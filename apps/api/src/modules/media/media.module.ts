import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { StorageService } from '../../common/services/storage.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MediaController],
  providers: [StorageService],
  exports: [StorageService],
})
export class MediaModule {}

