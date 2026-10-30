import { Module } from '@nestjs/common';
import { SevasController } from './sevas.controller';
import { SevasService } from './sevas.service';
import { AuditService } from '../../common/services/audit.service';

@Module({
  controllers: [SevasController],
  providers: [SevasService, AuditService],
  exports: [SevasService],
})
export class SevasModule {}
