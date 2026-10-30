import { Controller, Get, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@kushbhawanpur/shared';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS, Role.CONTENT)
  async getDashboard() {
    return this.donationsService.getDashboardStats();
  }
}
