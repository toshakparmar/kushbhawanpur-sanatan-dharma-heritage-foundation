import { Module } from '@nestjs/common';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';
import { AuditService } from '../../common/services/audit.service';

@Module({
  controllers: [MilestonesController],
  providers: [MilestonesService, AuditService],
  exports: [MilestonesService],
})
export class MilestonesModule {}
