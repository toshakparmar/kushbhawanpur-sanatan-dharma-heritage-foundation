import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { AuditService } from '../../common/services/audit.service';

@Module({
  controllers: [VideosController],
  providers: [VideosService, AuditService],
  exports: [VideosService],
})
export class VideosModule {}
