import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { DonationStatus } from '@kushbhawanpur/shared';

@Injectable()
export class DonorsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private encryptionService: EncryptionService,
  ) {}

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { name: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
        { phone: { contains: s } },
      ];
    }

    const [donors, total] = await Promise.all([
      this.prisma.donor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          donations: {
            where: { status: DonationStatus.VERIFIED },
            select: { receivedAmountPaise: true, createdAt: true },
          },
        },
      }),
      this.prisma.donor.count({ where }),
    ]);

    const items = donors.map((d) => {
      const verifiedDonations = d.donations;
      const totalPaise = verifiedDonations.reduce((sum, item) => sum + (item.receivedAmountPaise || 0), 0);
      const dates = verifiedDonations.map((item) => item.createdAt.getTime());
      const firstDonation = dates.length > 0 ? new Date(Math.min(...dates)) : null;
      const lastDonation = dates.length > 0 ? new Date(Math.max(...dates)) : null;

      return {
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        totalDonatedPaise: totalPaise,
        totalDonatedRupees: totalPaise / 100,
        donationCount: verifiedDonations.length,
        firstDonation,
        lastDonation,
        consentAt: d.consentAt,
        createdAt: d.createdAt,
      };
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const donor = await this.prisma.donor.findUnique({
      where: { id },
      include: {
        donations: {
          orderBy: { createdAt: 'desc' },
          include: { seva: true, receipt: true },
        },
      },
    });

    if (!donor) {
      throw new NotFoundException('Donor not found.');
    }

    let address = null;
    let pan = null;
    if (donor.addressEnc) {
      try {
        address = this.encryptionService.decrypt(donor.addressEnc);
      } catch {}
    }
    if (donor.panEnc) {
      try {
        pan = this.encryptionService.decrypt(donor.panEnc);
      } catch {}
    }

    return {
      ...donor,
      address,
      pan,
      donations: donor.donations.map((d) => ({
        id: d.id,
        refId: d.refId,
        amountRupees: (d.receivedAmountPaise || d.amountPaise) / 100,
        status: d.status,
        method: d.method,
        sevaTitle: d.seva.titleEn,
        receiptNo: d.receipt?.receiptNo || null,
        createdAt: d.createdAt,
      })),
    };
  }

  async anonymize(adminId: string, id: string, ip?: string) {
    const updated = await this.prisma.donor.update({
      where: { id },
      data: {
        name: 'Anonymous Donor',
        email: `erased-${id.slice(0, 8)}@privacy.local`,
        phone: '0000000000',
        addressEnc: null,
        panEnc: null,
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'DONOR_ANONYMIZED_DPDP',
      entity: 'Donor',
      entityId: id,
      ip,
    });

    return { success: true, message: 'Donor personal data erased under DPDP request.' };
  }
}
