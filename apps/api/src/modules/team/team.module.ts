import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { AuditService } from '../../common/services/audit.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService, AuditService],
  exports: [TeamService],
})
export class TeamModule {}
