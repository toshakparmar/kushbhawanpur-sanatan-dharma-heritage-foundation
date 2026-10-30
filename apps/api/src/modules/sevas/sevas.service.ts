import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';

@Injectable()
export class SevasService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.seva.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.seva.findUnique({
      where: { id },
    });
  }

  async create(adminId: string, dto: any, ip?: string) {
    const slug = dto.slug || dto.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const seva = await this.prisma.seva.create({
      data: {
        ...(dto.id && { id: dto.id }),
        slug,
        titleEn: dto.titleEn,
        titleHi: dto.titleHi || '',
        description: dto.description || '',
        suggestedAmounts: dto.suggestedAmounts || [501, 1100, 2100, 5100],
        imageUrl: dto.imageUrl || dto.image || null,
        active: dto.active !== undefined ? Boolean(dto.active) : true,
        sortOrder: Number(dto.sortOrder ?? dto.sort) || 0,
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'SEVA_CREATED',
      entity: 'Seva',
      entityId: seva.id,
      ip,
    });

    return seva;
  }

  async update(adminId: string, id: string, dto: any, ip?: string) {
    const updated = await this.prisma.seva.update({
      where: { id },
      data: {
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.titleEn && { titleEn: dto.titleEn }),
        ...(dto.titleHi !== undefined && { titleHi: dto.titleHi }),
        ...(dto.description && { description: dto.description }),
        ...(dto.suggestedAmounts && { suggestedAmounts: dto.suggestedAmounts }),
        ...((dto.imageUrl !== undefined || dto.image !== undefined) && { imageUrl: dto.imageUrl || dto.image }),
        ...(dto.active !== undefined && { active: Boolean(dto.active) }),
        ...((dto.sortOrder !== undefined || dto.sort !== undefined) && { sortOrder: Number(dto.sortOrder ?? dto.sort) }),
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'SEVA_UPDATED',
      entity: 'Seva',
      entityId: id,
      ip,
    });

    return updated;
  }

  async delete(adminId: string, id: string, ip?: string) {
    const deleted = await this.prisma.seva.delete({
      where: { id },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'SEVA_DELETED',
      entity: 'Seva',
      entityId: id,
      ip,
    });

    return deleted;
  }
}
