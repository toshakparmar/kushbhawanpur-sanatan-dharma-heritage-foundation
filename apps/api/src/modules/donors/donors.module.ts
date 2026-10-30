import { Module } from '@nestjs/common';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';
import { AuditService } from '../../common/services/audit.service';
import { EncryptionService } from '../../common/services/encryption.service';

@Module({
  controllers: [DonorsController],
  providers: [DonorsService, AuditService, EncryptionService],
  exports: [DonorsService],
})
export class DonorsModule {}
