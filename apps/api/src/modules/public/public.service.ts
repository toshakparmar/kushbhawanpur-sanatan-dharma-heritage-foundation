import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { MailService } from '../../common/services/mail.service';
import { StorageService } from '../../common/services/storage.service';
import { DonationStatus, PaymentMethod, QrMode } from '@kushbhawanpur/shared';
import * as crypto from 'crypto';

@Injectable()
export class PublicService {
  private readonly logger = new Logger(PublicService.name);

  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
    private mailService: MailService,
    private storageService: StorageService,
  ) {}

  /**
   * Fetches public site content. If database has no entries for team/certifications/videos,
   * empty arrays are returned so frontend components automatically hide them.
   */
  async getSiteContent() {
    const [
      siteSettings,
      navItems,
      pageSections,
      heroSlides,
      trustItems,
      valuePillars,
      focusAreas,
      storyChapters,
      impactItems,
      donorBenefits,
      galleryItems,
      involveCards,
      faqItems,
      pledgeContent,
      policies,
      announcements,
      org,
      milestones,
      team,
      certifications,
      videos,
    ] = await Promise.all([
      this.prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
      this.prisma.navItem.findMany({
        where: { isVisible: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.pageSection.findMany({
        where: { enabled: true },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.heroSlide.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.trustItem.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.valuePillar.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.focusArea.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.storyChapter.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.impactItem.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.donorBenefit.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.galleryItem.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.involveCard.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.faqItem.findMany({
        where: { active: true, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.pledgeContent.findUnique({ where: { id: 'singleton' } }),
      this.prisma.policyPage.findMany({ where: { deletedAt: null } }),
      this.prisma.announcement.findMany({
        where: { active: true, deletedAt: null },
      }),
      this.prisma.organization.findUnique({ where: { id: 'singleton' } }),
      this.prisma.milestone.findMany({
        where: { deletedAt: null },
        orderBy: [{ sortOrder: 'asc' }, { year: 'asc' }],
      }),
      this.prisma.teamMember.findMany({
        where: { active: true, deletedAt: null },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      }),
      this.prisma.certification.findMany({
        where: { active: true, deletedAt: null },
        orderBy: [{ sortOrder: 'asc' }, { issueDate: 'desc' }],
      }),
      this.prisma.video.findMany({
        where: { published: true, deletedAt: null },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
    ]);

    // Compute live stats if enabled
    let stats = null;
    if (siteSettings?.liveStatsEnabled) {
      const verifiedAgg = await this.prisma.donation.aggregate({
        where: { status: DonationStatus.VERIFIED },
        _count: { id: true },
        _sum: { amountPaise: true },
      });
      const uniqueDonorsCount = await this.prisma.donor.count();
      const offsetPaise = siteSettings.statsHistoricalAmountOffsetPaise || BigInt(0);
      const offsetDonors = siteSettings.statsHistoricalDonorsOffset || 0;

      const totalPaise = (verifiedAgg._sum.amountPaise || BigInt(0)) + offsetPaise;
      const totalDonors = uniqueDonorsCount + offsetDonors;

      stats = {
        totalAmountRupees: Number(totalPaise / BigInt(100)),
        totalDonationsCount: verifiedAgg._count.id + offsetDonors,
        totalDonorsCount: totalDonors,
      };
    }

    return {
      siteSettings: siteSettings
        ? {
            ...siteSettings,
            statsHistoricalAmountOffsetPaise: siteSettings.statsHistoricalAmountOffsetPaise
              ? Number(siteSettings.statsHistoricalAmountOffsetPaise)
              : 0,
          }
        : null,
      navItems,
      pageSections,
      heroSlides,
      trustItems,
      valuePillars,
      focusAreas,
      storyChapters,
      impactItems,
      donorBenefits,
      galleryItems,
      involveCards,
      faqItems,
      pledgeContent,
      policies,
      announcements,
      org: org || {
        nameEn: 'Kushbhawanpur Sanatan Dharma & Heritage Foundation',
        nameHi: 'कुशभवनपुर सनातन धर्म एवं हेरिटेज फाउंडेशन',
        logoUrl: '/brand/logo-original.png',
      },
      milestones: milestones || [],
      team: team || [],
      certifications: certifications || [],
      videos: videos || [],
      stats,
    };
  }

  async submitContact(dto: { name: string; email: string; phone?: string; interest?: string; message: string; honeypot?: string }, ip?: string) {
    if (dto.honeypot) {
      // Spam honeypot triggered
      return { success: true };
    }
    if (!dto.name || !dto.email || !dto.message) {
      throw new BadRequestException('Name, email, and message are required.');
    }

    const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16) : undefined;

    const message = await this.prisma.contactMessage.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim(),
        interest: dto.interest?.trim(),
        message: dto.message.trim(),
        ipHash,
        status: 'NEW',
      },
    });

    return { success: true, messageId: message.id };
  }

  async submitVolunteer(dto: { name: string; phone: string; email: string; city?: string; skills?: string; availability?: string; message?: string; honeypot?: string }) {
    if (dto.honeypot) {
      return { success: true };
    }
    if (!dto.name || !dto.phone || !dto.email) {
      throw new BadRequestException('Name, phone, and email are required.');
    }

    const application = await this.prisma.volunteerApplication.create({
      data: {
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        email: dto.email.trim().toLowerCase(),
        city: dto.city?.trim(),
        skills: dto.skills?.trim(),
        availability: dto.availability?.trim(),
        message: dto.message?.trim(),
        status: 'NEW',
      },
    });

    return { success: true, applicationId: application.id };
  }

  /**
   * Fetches donation configuration including active sevas, payment settings, primary UPI, and public bank accounts.
   */
  async getDonateConfig() {
    const [settings, primaryUpi, bankAccounts, sevas] = await Promise.all([
      this.prisma.paymentSettings.findUnique({
        where: { id: 'singleton' },
      }),
      this.prisma.upiAccount.findFirst({
        where: { isPrimary: true, active: true },
      }),
      this.prisma.bankAccount.findMany({
        where: { showPublic: true },
      }),
      this.prisma.seva.findMany({
        where: { active: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      }),
    ]);

    // Mask bank account numbers for public view (only last 4 visible)
    const publicBankAccounts = bankAccounts.map((acc) => {
      let maskedNumber = '****';
      try {
        const decrypted = this.encryptionService.decrypt(acc.accountNumberEnc);
        maskedNumber = `****${decrypted.slice(-4)}`;
      } catch {
        maskedNumber = '****';
      }
      return {
        id: acc.id,
        holder: acc.holder,
        bank: acc.bank,
        branch: acc.branch,
        ifsc: acc.ifsc,
        type: acc.type,
        accountNumberMasked: maskedNumber,
      };
    });

    const minAmountPaise = settings?.minAmountRupees ? settings.minAmountRupees * 100 : 10000;
    const maxAmountPaise = settings?.maxAmountRupees ? settings.maxAmountRupees * 100 : 100000000;

    return {
      paymentSettings: settings
        ? {
            ...settings,
            minAmountPaise,
            maxAmountPaise,
          }
        : {
            qrMode: QrMode.DYNAMIC,
            minAmountPaise: 10000,
            maxAmountPaise: 100000000,
            presetAmounts: [501, 1100, 2100, 5100, 11000, 21000],
            allowUpi: true,
            allowBank: true,
            allowCheque: true,
            allowCsr: true,
          },
      primaryUpi: primaryUpi
        ? {
            id: primaryUpi.id,
            label: primaryUpi.label,
            vpa: primaryUpi.vpa,
            payeeName: primaryUpi.payeeName,
          }
        : null,
      bankAccounts: publicBankAccounts,
      sevas: sevas || [],
    };
  }

  /**
   * Initiates a donation record and generates dynamic UPI URI
   */
  async createDonation(dto: any) {
    const { sevaId, amountPaise, donor, method, anonymous, dedication } = dto;

    // Validate seva
    const seva = await this.prisma.seva.findUnique({
      where: { id: sevaId },
    });
    if (!seva || !seva.active) {
      throw new BadRequestException('Selected Seva / Purpose is inactive or invalid.');
    }

    // Validate amount boundaries
    const settings = await this.prisma.paymentSettings.findUnique({
      where: { id: 'singleton' },
    });
    const minPaise = settings?.minAmountRupees ? settings.minAmountRupees * 100 : 10000;
    const maxPaise = settings?.maxAmountRupees ? settings.maxAmountRupees * 100 : 100000000;

    if (amountPaise < minPaise || amountPaise > maxPaise) {
      throw new BadRequestException(
        `Donation amount must be between ₹${minPaise / 100} and ₹${maxPaise / 100}.`,
      );
    }

    // Generate unique reference ID e.g. KSDHF-7K3Q9M
    const refCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const refId = `KSDHF-${refCode}`;

    // Generate secret donorToken and its SHA-256 hash
    const donorToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(donorToken).digest('hex');

    // Encrypt sensitive donor fields if provided
    const panEnc = donor.pan ? this.encryptionService.encrypt(donor.pan.toUpperCase().trim()) : null;
    const addressEnc = donor.address ? this.encryptionService.encrypt(donor.address.trim()) : null;

    // Find or create donor record
    let donorRecord = await this.prisma.donor.findFirst({
      where: { email: donor.email.toLowerCase().trim() },
    });

    if (!donorRecord) {
      donorRecord = await this.prisma.donor.create({
        data: {
          name: donor.name.trim(),
          email: donor.email.toLowerCase().trim(),
          phone: donor.phone.trim(),
          panEnc,
          addressEnc,
          consentAt: new Date(),
        },
      });
    } else {
      // Update donor record with latest PAN / address if not present
      await this.prisma.donor.update({
        where: { id: donorRecord.id },
        data: {
          name: donor.name.trim(),
          phone: donor.phone.trim(),
          ...(panEnc ? { panEnc } : {}),
          ...(addressEnc ? { addressEnc } : {}),
        },
      });
    }

    // Get primary UPI VPA snapshot
    const primaryUpi = await this.prisma.upiAccount.findFirst({
      where: { isPrimary: true, active: true },
    });

    // Create donation with INITIATED status
    const donation = await this.prisma.donation.create({
      data: {
        refId,
        donorId: donorRecord.id,
        donorSnapshot: {
          name: donor.name.trim(),
          email: donor.email.toLowerCase().trim(),
          phone: donor.phone.trim(),
          panProvided: Boolean(donor.pan),
        },
        amountPaise,
        sevaId: seva.id,
        method: method || PaymentMethod.UPI,
        status: DonationStatus.INITIATED,
        anonymous: Boolean(anonymous),
        dedication: dedication ? dedication.trim() : null,
        upiVpaSnapshot: primaryUpi?.vpa || null,
        tokenHash,
      },
    });

    // Build dynamic UPI URI if primary UPI exists
    let upiUri = '';
    if (primaryUpi) {
      const amountRupees = (amountPaise / 100).toFixed(2);
      const shortSeva = seva.titleEn.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '');
      const note = `${refId} ${shortSeva}`.trim();
      const payee = encodeURIComponent(primaryUpi.payeeName);
      const vpa = encodeURIComponent(primaryUpi.vpa);
      const encNote = encodeURIComponent(note);
      upiUri = `upi://pay?pa=${vpa}&pn=${payee}&am=${amountRupees}&cu=INR&tn=${encNote}`;
    }

    return {
      refId: donation.refId,
      donorToken,
      amountPaise: donation.amountPaise,
      amountRupees: Number(donation.amountPaise) / 100,
      seva: {
        id: seva.id,
        titleEn: seva.titleEn,
        titleHi: seva.titleHi,
      },
      upiUri,
      primaryUpi: primaryUpi
        ? {
            vpa: primaryUpi.vpa,
            payeeName: primaryUpi.payeeName,
          }
        : null,
      verificationSlaText: settings?.verificationSlaText,
    };
  }

  /**
   * Submits proof of payment (UTR number + optional screenshot)
   */
  async submitProof(refId: string, token: string, dto: { utr: string; paymentAt?: string }, proofFile?: Express.Multer.File) {
    const donation = await this.prisma.donation.findUnique({
      where: { refId },
      include: { seva: true, donor: true },
    });

    if (!donation) {
      throw new NotFoundException('Donation reference not found.');
    }

    // Verify token
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (donation.tokenHash !== tokenHash) {
      throw new UnauthorizedException('Invalid or expired donor token for this donation reference.');
    }

    if (donation.status === DonationStatus.VERIFIED) {
      throw new BadRequestException('This donation has already been verified and receipt issued.');
    }

    let proofUrl = donation.proofUrl;
    if (proofFile) {
      const stored = await this.storageService.saveBuffer(
        proofFile.buffer,
        proofFile.originalname,
        proofFile.mimetype,
        { folder: 'proofs' },
      );
      proofUrl = stored.url;
    }

    // Update status to PENDING_VERIFICATION
    const updated = await this.prisma.donation.update({
      where: { refId },
      data: {
        utr: dto.utr.trim(),
        paymentAt: dto.paymentAt ? new Date(dto.paymentAt) : new Date(),
        proofUrl,
        status: DonationStatus.PENDING_VERIFICATION,
      },
    });

    // Send confirmation email to donor
    const donorSnapshot = donation.donorSnapshot as any;
    if (donorSnapshot?.email) {
      const org = await this.prisma.organization.findUnique({ where: { id: 'singleton' } });
      await this.mailService.sendProofReceived({
        to: donorSnapshot.email,
        donorName: donorSnapshot.name,
        refId: donation.refId,
        amountPaise: donation.amountPaise,
        sevaTitle: donation.seva.titleEn,
        utr: dto.utr.trim(),
        orgName: org?.nameEn || 'Kushbhawanpur Foundation',
      });
    }

    return {
      success: true,
      refId: updated.refId,
      status: updated.status,
      message: 'Payment proof received. Our accounts team will verify and email your official receipt.',
    };
  }

  /**
   * Retrieves public donation status
   */
  async getDonationStatus(refId: string, contact?: string, token?: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { refId },
      include: {
        seva: true,
        receipt: true,
      },
    });

    if (!donation) {
      throw new NotFoundException('Donation reference not found.');
    }

    const donorSnapshot = donation.donorSnapshot as any;

    // Check authorization: either matching token or matching contact (email or phone)
    if (token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      if (donation.tokenHash !== tokenHash) {
        throw new UnauthorizedException('Invalid donor access token.');
      }
    } else if (contact) {
      const cleanContact = contact.toLowerCase().trim();
      const emailMatches = donorSnapshot?.email?.toLowerCase() === cleanContact;
      const phoneMatches = donorSnapshot?.phone?.replace(/\D/g, '') === cleanContact.replace(/\D/g, '');
      if (!emailMatches && !phoneMatches) {
        throw new UnauthorizedException('The provided contact does not match this donation.');
      }
    } else {
      throw new BadRequestException('Contact (email or mobile) or donor token is required to view donation status.');
    }

    return {
      refId: donation.refId,
      status: donation.status,
      amountPaise: donation.amountPaise,
      amountRupees: Number(donation.amountPaise) / 100,
      sevaTitle: donation.seva.titleEn,
      utr: donation.utr ? `****${donation.utr.slice(-4)}` : null,
      createdAt: donation.createdAt,
      paymentAt: donation.paymentAt,
      verifiedAt: donation.verifiedAt,
      rejectReason: donation.status === DonationStatus.REJECTED ? donation.rejectReason : null,
      receiptNo: donation.receipt?.receiptNo || null,
      hasReceipt: Boolean(donation.receipt),
    };
  }

  /**
   * Public receipt verification check without exposing donor PII
   */
  async verifyReceiptPublic(receiptNo: string) {
    const receipt = await this.prisma.receipt.findUnique({
      where: { receiptNo: decodeURIComponent(receiptNo).trim() },
      include: {
        donation: {
          include: { seva: true },
        },
      },
    });

    if (!receipt) {
      return {
        isValid: false,
        message: 'Receipt not found or invalid receipt number.',
      };
    }

    const org = await this.prisma.organization.findUnique({ where: { id: 'singleton' } });

    return {
      isValid: !receipt.voidedAt,
      receiptNo: receipt.receiptNo,
      issuedAt: receipt.issuedAt,
      amountPaise: receipt.donation.amountPaise,
      amountRupees: Number(receipt.donation.amountPaise) / 100,
      sevaTitle: receipt.donation.seva.titleEn,
      paymentMethod: receipt.donation.method,
      orgName: org?.nameEn || 'Kushbhawanpur Sanatan Dharma & Heritage Foundation',
      isVoid: Boolean(receipt.voidedAt),
      voidedAt: receipt.voidedAt,
      voidReason: receipt.voidReason,
    };
  }

  /**
   * Subscribes a user to monthly seva reminders
   */
  async createReminder(email: string, sevaId?: string, dayOfMonth: number = 1) {
    return this.prisma.reminderSubscription.create({
      data: {
        name: 'Devotee',
        phone: '',
        email: email.toLowerCase().trim(),
        sevaId: sevaId || null,
        preferredDay: Math.min(Math.max(dayOfMonth, 1), 28),
      },
    });
  }
}
