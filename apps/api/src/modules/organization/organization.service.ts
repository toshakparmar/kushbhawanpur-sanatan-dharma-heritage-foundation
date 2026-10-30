import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async getProfile() {
    return this.prisma.organization.findUnique({
      where: { id: 'singleton' },
    });
  }

  async updateProfile(adminId: string, dto: any, ip?: string) {
    const updated = await this.prisma.organization.upsert({
      where: { id: 'singleton' },
      update: { ...dto },
      create: { id: 'singleton', ...dto },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'ORGANIZATION_UPDATED',
      entity: 'Organization',
      entityId: 'singleton',
      ip,
    });

    return updated;
  }
}
