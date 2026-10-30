import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReceiptsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { receiptNo: { contains: s, mode: 'insensitive' } },
        {
          donation: {
            OR: [
              { refId: { contains: s, mode: 'insensitive' } },
              { donor: { name: { contains: s, mode: 'insensitive' } } },
            ],
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.receipt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { issuedAt: 'desc' },
        include: {
          donation: {
            include: {
              donor: true,
              seva: true,
            },
          },
        },
      }),
      this.prisma.receipt.count({ where }),
    ]);

    return {
      items: items.map((r) => ({
        id: r.id,
        receiptNo: r.receiptNo,
        fy: r.fy,
        seq: r.seq,
        issuedAt: r.issuedAt,
        pdfUrl: r.pdfUrl,
        voidedAt: r.voidedAt,
        voidReason: r.voidReason,
        refId: r.donation.refId,
        donorName: r.donation.donor.name,
        donorEmail: r.donation.donor.email,
        amountRupees: Number(r.donation.receivedAmountPaise || r.donation.amountPaise) / 100,
        sevaTitle: r.donation.seva.titleEn,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const receipt = await this.prisma.receipt.findUnique({
      where: { id },
      include: {
        donation: {
          include: { donor: true, seva: true },
        },
      },
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found.');
    }

    return receipt;
  }
}
