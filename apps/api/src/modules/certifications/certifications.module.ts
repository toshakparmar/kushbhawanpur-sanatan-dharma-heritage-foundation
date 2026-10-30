import { Module } from '@nestjs/common';
import { CertificationsController } from './certifications.controller';
import { CertificationsService } from './certifications.service';
import { AuditService } from '../../common/services/audit.service';

@Module({
  controllers: [CertificationsController],
  providers: [CertificationsService, AuditService],
  exports: [CertificationsService],
})
export class CertificationsModule {}
