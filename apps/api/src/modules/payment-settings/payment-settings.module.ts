import { Module } from '@nestjs/common';
import { PaymentSettingsController } from './payment-settings.controller';
import { PaymentSettingsService } from './payment-settings.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { AuditService } from '../../common/services/audit.service';

@Module({
  controllers: [PaymentSettingsController],
  providers: [PaymentSettingsService, EncryptionService, AuditService],
  exports: [PaymentSettingsService],
})
export class PaymentSettingsModule {}
