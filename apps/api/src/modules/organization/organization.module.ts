import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { AuditService } from '../../common/services/audit.service';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, AuditService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
