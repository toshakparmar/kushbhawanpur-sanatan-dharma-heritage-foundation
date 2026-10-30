import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';

@Injectable()
export class CertificationsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.certification.findMany({
      orderBy: [{ sortOrder: 'asc' }, { issueDate: 'desc' }],
    });
  }

  async findOne(id: string) {
    return this.prisma.certification.findUnique({
      where: { id },
    });
  }

  async create(adminId: string, dto: any, ip?: string) {
    const cert = await this.prisma.certification.create({
      data: {
        title: dto.title,
        issuer: dto.issuer,
        number: dto.number || null,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        fileUrl: dto.fileUrl,
        thumbUrl: dto.thumbUrl || dto.fileUrl,
        sortOrder: Number(dto.sortOrder ?? dto.sort) || 0,
        active: dto.active !== undefined ? Boolean(dto.active) : true,
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'CERTIFICATION_CREATED',
      entity: 'Certification',
      entityId: cert.id,
      meta: { title: cert.title },
      ip,
    });

    return cert;
  }

  async update(adminId: string, id: string, dto: any, ip?: string) {
    const updated = await this.prisma.certification.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.issuer && { issuer: dto.issuer }),
        ...(dto.number !== undefined && { number: dto.number }),
        ...(dto.issueDate !== undefined && {
          issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        }),
        ...(dto.fileUrl && { fileUrl: dto.fileUrl }),
        ...(dto.thumbUrl !== undefined && { thumbUrl: dto.thumbUrl }),
        ...((dto.sortOrder !== undefined || dto.sort !== undefined) && {
          sortOrder: Number(dto.sortOrder ?? dto.sort),
        }),
        ...(dto.active !== undefined && { active: Boolean(dto.active) }),
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'CERTIFICATION_UPDATED',
      entity: 'Certification',
      entityId: id,
      ip,
    });

    return updated;
  }

  async delete(adminId: string, id: string, ip?: string) {
    const deleted = await this.prisma.certification.delete({
      where: { id },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'CERTIFICATION_DELETED',
      entity: 'Certification',
      entityId: id,
      ip,
    });

    return deleted;
  }
}
