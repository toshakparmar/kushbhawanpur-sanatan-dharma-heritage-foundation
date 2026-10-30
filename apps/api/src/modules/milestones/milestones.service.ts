import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';

@Injectable()
export class MilestonesService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.milestone.findMany({
      orderBy: [{ sortOrder: 'asc' }, { year: 'asc' }],
    });
  }

  async findOne(id: string) {
    return this.prisma.milestone.findUnique({
      where: { id },
    });
  }

  async create(adminId: string, dto: any, ip?: string) {
    const item = await this.prisma.milestone.create({
      data: {
        year: dto.year.trim(),
        title: dto.title.trim(),
        text: dto.text.trim(),
        sortOrder: Number(dto.sortOrder ?? dto.sort) || 0,
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'MILESTONE_CREATED',
      entity: 'Milestone',
      entityId: item.id,
      ip,
    });

    return item;
  }

  async update(adminId: string, id: string, dto: any, ip?: string) {
    const updated = await this.prisma.milestone.update({
      where: { id },
      data: {
        ...(dto.year && { year: dto.year.trim() }),
        ...(dto.title && { title: dto.title.trim() }),
        ...(dto.text && { text: dto.text.trim() }),
        ...((dto.sortOrder !== undefined || dto.sort !== undefined) && {
          sortOrder: Number(dto.sortOrder ?? dto.sort),
        }),
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'MILESTONE_UPDATED',
      entity: 'Milestone',
      entityId: id,
      ip,
    });

    return updated;
  }

  async delete(adminId: string, id: string, ip?: string) {
    const deleted = await this.prisma.milestone.delete({
      where: { id },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'MILESTONE_DELETED',
      entity: 'Milestone',
      entityId: id,
      ip,
    });

    return deleted;
  }
}
