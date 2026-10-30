import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface LogAuditParams {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: any;
  ip?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async log(params: LogAuditParams): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: params.actorId || null,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId || null,
          meta: params.meta ? JSON.stringify(params.meta) : null,
          ip: params.ip || null,
        },
      });
    } catch (err: any) {
      this.logger.error(`Failed to record audit log: ${err.message}`, err.stack);
    }
  }
}
