import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PdfService } from '../../common/services/pdf.service';
import { MailService } from '../../common/services/mail.service';
import { StorageService } from '../../common/services/storage.service';
import { AuditService } from '../../common/services/audit.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { DonationStatus, PaymentMethod } from '@kushbhawanpur/shared';
import * as crypto from 'crypto';

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);

  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
    private mailService: MailService,
    private storageService: StorageService,
    private auditService: AuditService,
    private encryptionService: EncryptionService,
  ) {}

  /**
   * Calculates the Indian Financial Year string (e.g., "2026-27")
   */
  getFinancialYear(date: Date = new Date(), startMonth: number = 4): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-indexed

    let fyStartYear: number;
    let fyEndYear: number;

    if (month >= startMonth) {
      fyStartYear = year;
      fyEndYear = year + 1;
    } else {
      fyStartYear = year - 1;
      fyEndYear = year;
    }

    const endYearShort = String(fyEndYear).slice(-2);
    return `${fyStartYear}-${endYearShort}`;
  }

  /**
   * Paginated list of donations for admin table
   */
  async findAll(query: {
    page?: number;
    limit?: number;
    status?: string;
    sevaId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.sevaId) {
      where.sevaId = query.sevaId;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { refId: { contains: s, mode: 'insensitive' } },
        { utr: { contains: s, mode: 'insensitive' } },
        {
          donor: {
            OR: [
              { name: { contains: s, mode: 'insensitive' } },
              { email: { contains: s, mode: 'insensitive' } },
              { phone: { contains: s } },
            ],
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          donor: true,
          seva: true,
          receipt: true,
        },
      }),
      this.prisma.donation.count({ where }),
    ]);

    return {
      items: items.map((d) => ({
        id: d.id,
        refId: d.refId,
        amountPaise: d.amountPaise,
        receivedAmountPaise: d.receivedAmountPaise,
        amountRupees: Number(d.amountPaise) / 100,
        status: d.status,
        method: d.method,
        utr: d.utr,
        donorName: d.donor.name,
        donorEmail: d.donor.email,
        donorPhone: d.donor.phone,
        anonymous: d.anonymous,
        sevaTitle: d.seva.titleEn,
        receiptNo: d.receipt?.receiptNo || null,
        paymentAt: d.paymentAt,
        createdAt: d.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Detailed donation record with decrypted fields for admin review
   */
  async findOne(id: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: {
        donor: true,
        seva: true,
        receipt: true,
        verifiedBy: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    if (!donation) {
      throw new NotFoundException('Donation not found.');
    }

    let decryptedAddress = null;
    let decryptedPan = null;

    if (donation.donor.addressEnc) {
      try {
        decryptedAddress = this.encryptionService.decrypt(donation.donor.addressEnc);
      } catch {
        decryptedAddress = '[Encrypted Address]';
      }
    }

    if (donation.donor.panEnc) {
      try {
        decryptedPan = this.encryptionService.decrypt(donation.donor.panEnc);
      } catch {
        decryptedPan = '[Encrypted PAN]';
      }
    }

    return {
      ...donation,
      donor: {
        ...donation.donor,
        address: decryptedAddress,
        pan: decryptedPan,
      },
    };
  }

  /**
   * Atomic verification of a donation:
   * 1. Validates status is not already VERIFIED
   * 2. Runs transaction: updates donation, increments FY counter atomically, creates Receipt record
   * 3. Generates official PDF receipt (Devanagari enabled)
   * 4. Enqueues / sends receipt email to donor
   */
  async verifyDonation(
    donationId: string,
    adminId: string,
    dto?: { receivedAmountPaise?: number; notes?: string },
    ip?: string,
  ) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { donor: true, seva: true, receipt: true },
    });

    if (!donation) {
      throw new NotFoundException('Donation not found.');
    }

    if (donation.status === DonationStatus.VERIFIED && donation.receipt) {
      return {
        success: true,
        message: 'Donation was already verified.',
        receiptNo: donation.receipt.receiptNo,
      };
    }

    const org = await this.prisma.organization.findUnique({ where: { id: 'singleton' } });
    const prefix = org?.receiptPrefix || 'KSDHF';
    const fy = this.getFinancialYear(new Date(), org?.fyStartMonth || 4);

    const receivedAmount = dto?.receivedAmountPaise || donation.amountPaise;

    // Interactive Transaction with atomic counter update
    const result = await this.prisma.$transaction(async (tx) => {
      // Upsert receipt counter for this financial year
      const counter = await tx.receiptCounter.upsert({
        where: { fy },
        update: { lastSeq: { increment: 1 } },
        create: { fy, lastSeq: 1 },
      });

      const seqNumber = String(counter.lastSeq).padStart(5, '0');
      const receiptNo = `${prefix}/${fy}/${seqNumber}`;

      // Update donation record
      const updatedDonation = await tx.donation.update({
        where: { id: donation.id },
        data: {
          status: DonationStatus.VERIFIED,
          receivedAmountPaise: receivedAmount,
          verifiedById: adminId,
          verifiedAt: new Date(),
        },
      });

      // Create Receipt record
      const newReceipt = await tx.receipt.create({
        data: {
          receiptNo,
          fy,
          seq: counter.lastSeq,
          donationId: donation.id,
          issuedAt: new Date(),
        },
      });

      return { updatedDonation, newReceipt };
    });

    // Decrypt donor address and PAN for PDF generation if available
    let donorAddress: string | undefined;
    let donorPan: string | undefined;

    if (donation.donor.addressEnc) {
      try {
        donorAddress = this.encryptionService.decrypt(donation.donor.addressEnc);
      } catch {}
    }

    if (donation.donor.panEnc) {
      try {
        donorPan = this.encryptionService.decrypt(donation.donor.panEnc);
      } catch {}
    }

    // Generate PDF receipt buffer
    let pdfUrl = '';
    try {
      const pdfBuffer = await this.pdfService.generateReceipt({
        receiptNo: result.newReceipt.receiptNo,
        date: result.newReceipt.issuedAt,
        refId: donation.refId,
        donorName: donation.donor.name,
        donorEmail: donation.donor.email,
        donorPhone: donation.donor.phone,
        donorAddress,
        donorPan,
        amountPaise: receivedAmount,
        sevaTitle: donation.seva.titleEn,
        paymentMethod: donation.method,
        utr: donation.utr || undefined,
        orgNameEn: org?.nameEn || 'Kushbhawanpur Sanatan Dharma & Heritage Foundation',
        orgNameHi: org?.nameHi || 'कुशभवनपुर सनातन धर्म एवं हेरिटेज फाउंडेशन',
        orgAddress: org?.address || undefined,
        orgPhone: org?.phone || undefined,
        orgEmail: org?.email || undefined,
        orgRegNo: org?.regNo || undefined,
        orgPan: org?.panNo || undefined,
        org80G: org?.approval80G || undefined,
        org12A: org?.approval12A || undefined,
        signatoryName: org?.signatoryName || undefined,
        signatoryDesignation: org?.signatoryDesignation || undefined,
        signatureUrl: org?.signatureUrl || undefined,
        footerNote: org?.receiptFooterNote || undefined,
      });

      const stored = await this.storageService.saveBuffer(
        pdfBuffer,
        `receipt-${result.newReceipt.receiptNo.replace(/\//g, '-')}.pdf`,
        'application/pdf',
        { folder: 'receipts' },
      );
      pdfUrl = stored.url;

      await this.prisma.receipt.update({
        where: { id: result.newReceipt.id },
        data: { pdfUrl },
      });

      // Send receipt email to donor with attached PDF
      if (donation.donor.email) {
        await this.mailService.sendDonationReceipt({
          to: donation.donor.email,
          donorName: donation.donor.name,
          receiptNo: result.newReceipt.receiptNo,
          amountPaise: receivedAmount,
          sevaTitle: donation.seva.titleEn,
          pdfBuffer,
          orgName: org?.nameEn || 'Kushbhawanpur Foundation',
        });
      }
    } catch (err: any) {
      this.logger.error(`Failed to generate or email receipt: ${err.message}`, err.stack);
    }

    await this.auditService.log({
      actorId: adminId,
      action: 'DONATION_VERIFIED',
      entity: 'Donation',
      entityId: donation.id,
      meta: {
        receiptNo: result.newReceipt.receiptNo,
        amountPaise: receivedAmount,
      },
      ip,
    });

    return {
      success: true,
      receiptNo: result.newReceipt.receiptNo,
      pdfUrl,
      status: DonationStatus.VERIFIED,
    };
  }

  /**
   * Rejects a donation with reason and notifies donor
   */
  async rejectDonation(donationId: string, adminId: string, reason: string, ip?: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { donor: true, seva: true },
    });

    if (!donation) {
      throw new NotFoundException('Donation not found.');
    }

    const updated = await this.prisma.donation.update({
      where: { id: donationId },
      data: {
        status: DonationStatus.REJECTED,
        rejectReason: reason.trim(),
      },
    });

    const org = await this.prisma.organization.findUnique({ where: { id: 'singleton' } });

    // Send email to donor explaining the rejection reason
    if (donation.donor.email) {
      await this.mailService.sendDonationRejected({
        to: donation.donor.email,
        donorName: donation.donor.name,
        refId: donation.refId,
        reason: reason.trim(),
        orgName: org?.nameEn || 'Kushbhawanpur Foundation',
      });
    }

    await this.auditService.log({
      actorId: adminId,
      action: 'DONATION_REJECTED',
      entity: 'Donation',
      entityId: donation.id,
      meta: { reason },
      ip,
    });

    return { success: true, status: updated.status, message: 'Donation rejected.' };
  }

  /**
   * Voids an issued receipt with reason (never deletes financial record)
   */
  async voidReceipt(donationId: string, adminId: string, reason: string, ip?: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { receipt: true },
    });

    if (!donation || !donation.receipt) {
      throw new NotFoundException('Donation or associated receipt not found.');
    }

    await this.prisma.$transaction([
      this.prisma.receipt.update({
        where: { id: donation.receipt.id },
        data: {
          voidedAt: new Date(),
          voidReason: reason.trim(),
        },
      }),
      this.prisma.donation.update({
        where: { id: donation.id },
        data: { status: DonationStatus.VOID },
      }),
    ]);

    await this.auditService.log({
      actorId: adminId,
      action: 'RECEIPT_VOIDED',
      entity: 'Receipt',
      entityId: donation.receipt.id,
      meta: { reason, receiptNo: donation.receipt.receiptNo },
      ip,
    });

    return { success: true, message: 'Receipt marked as void.' };
  }

  /**
   * Creates a manual offline donation entry (Cash, Cheque, RTGS) directly verified with receipt
   */
  async createManualDonation(adminId: string, dto: any, ip?: string) {
    const { sevaId, amountPaise, donor, method, utr, paymentAt, anonymous, dedication } = dto;

    const seva = await this.prisma.seva.findUnique({ where: { id: sevaId } });
    if (!seva) {
      throw new BadRequestException('Invalid Seva ID.');
    }

    const refCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const refId = `KSDHF-M${refCode}`;

    let donorRecord = await this.prisma.donor.findFirst({
      where: { email: donor.email.toLowerCase().trim() },
    });

    if (!donorRecord) {
      donorRecord = await this.prisma.donor.create({
        data: {
          name: donor.name.trim(),
          email: donor.email.toLowerCase().trim(),
          phone: donor.phone.trim(),
          consentAt: new Date(),
        },
      });
    }

    const donation = await this.prisma.donation.create({
      data: {
        refId,
        donorId: donorRecord.id,
        donorSnapshot: {
          name: donor.name.trim(),
          email: donor.email.toLowerCase().trim(),
          phone: donor.phone.trim(),
        },
        amountPaise,
        receivedAmountPaise: amountPaise,
        sevaId: seva.id,
        method: method || PaymentMethod.CASH,
        utr: utr || null,
        paymentAt: paymentAt ? new Date(paymentAt) : new Date(),
        status: DonationStatus.PENDING_VERIFICATION,
        anonymous: Boolean(anonymous),
        dedication: dedication || null,
        tokenHash: crypto.randomBytes(32).toString('hex'),
      },
    });

    // Verify immediately to generate receipt
    return this.verifyDonation(donation.id, adminId, { receivedAmountPaise: amountPaise }, ip);
  }

  /**
   * Dashboard statistics
   */
  async getDashboardStats() {
    const verifiedStatus = DonationStatus.VERIFIED;

    // All-time verified sum & count
    const allTimeStats = await this.prisma.donation.aggregate({
      where: { status: verifiedStatus },
      _sum: { receivedAmountPaise: true },
      _count: { id: true },
    });

    // Pending count
    const pendingCount = await this.prisma.donation.count({
      where: { status: DonationStatus.PENDING_VERIFICATION },
    });

    // Total unique donors
    const donorCount = await this.prisma.donor.count();

    // This month stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthStats = await this.prisma.donation.aggregate({
      where: {
        status: verifiedStatus,
        verifiedAt: { gte: startOfMonth },
      },
      _sum: { receivedAmountPaise: true },
      _count: { id: true },
    });

    // This Financial Year stats (starting April 1st)
    const currentYear = now.getFullYear();
    const fyStartYear = now.getMonth() >= 3 ? currentYear : currentYear - 1;
    const startOfFy = new Date(fyStartYear, 3, 1);
    const thisFyStats = await this.prisma.donation.aggregate({
      where: {
        status: verifiedStatus,
        verifiedAt: { gte: startOfFy },
      },
      _sum: { receivedAmountPaise: true },
    });

    // Donations by Seva
    const sevas = await this.prisma.seva.findMany({
      include: {
        donations: {
          where: { status: verifiedStatus },
          select: { receivedAmountPaise: true },
        },
      },
    });

    const sevaDistribution = sevas.map((s) => ({
      id: s.id,
      title: s.titleEn,
      totalPaise: s.donations.reduce((sum, d) => sum + Number(d.receivedAmountPaise || 0), 0),
      count: s.donations.length,
    }));

    // Recent 5 verified/pending donations
    const recent = await this.prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { donor: true, seva: true, receipt: true },
    });

    const totalVerifiedPaise = Number(allTimeStats._sum.receivedAmountPaise || 0);
    const totalCount = allTimeStats._count.id || 0;
    const avgPaise = totalCount > 0 ? Math.round(totalVerifiedPaise / totalCount) : 0;

    return {
      allTimeVerifiedPaise: totalVerifiedPaise,
      allTimeVerifiedRupees: totalVerifiedPaise / 100,
      thisFyVerifiedPaise: Number(thisFyStats._sum.receivedAmountPaise || 0),
      thisMonthVerifiedPaise: Number(thisMonthStats._sum.receivedAmountPaise || 0),
      verifiedCount: totalCount,
      pendingCount,
      donorCount,
      avgDonationPaise: avgPaise,
      avgDonationRupees: avgPaise / 100,
      sevaDistribution,
      recentDonations: recent.map((r) => ({
        id: r.id,
        refId: r.refId,
        donorName: r.donor.name,
        amountRupees: Number(r.receivedAmountPaise || r.amountPaise) / 100,
        status: r.status,
        sevaTitle: r.seva.titleEn,
        createdAt: r.createdAt,
      })),
    };
  }
}
