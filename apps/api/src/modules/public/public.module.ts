import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { MailService } from '../../common/services/mail.service';
import { StorageService } from '../../common/services/storage.service';

@Module({
  controllers: [PublicController],
  providers: [PublicService, EncryptionService, MailService, StorageService],
  exports: [PublicService],
})
export class PublicModule {}
