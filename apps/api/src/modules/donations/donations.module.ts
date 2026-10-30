import { Module } from '@nestjs/common';
import { DonationsController } from './donations.controller';
import { DashboardController } from './dashboard.controller';
import { DonationsService } from './donations.service';
import { PdfService } from '../../common/services/pdf.service';
import { MailService } from '../../common/services/mail.service';
import { StorageService } from '../../common/services/storage.service';
import { AuditService } from '../../common/services/audit.service';
import { EncryptionService } from '../../common/services/encryption.service';

@Module({
  controllers: [DonationsController, DashboardController],
  providers: [
    DonationsService,
    PdfService,
    MailService,
    StorageService,
    AuditService,
    EncryptionService,
  ],
  exports: [DonationsService],
})
export class DonationsModule {}
