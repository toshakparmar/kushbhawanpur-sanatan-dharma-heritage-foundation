import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@kushbhawanpur/shared';
import { DonationsService } from './donations.service';

@ApiTags('Admin Donations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  @ApiOperation({ summary: 'List all donations with filters and pagination' })
  async findAll(@Query() query: any) {
    return this.donationsService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  @ApiOperation({ summary: 'Get donation details by ID' })
  async findOne(@Param('id') id: string) {
    return this.donationsService.findOne(id);
  }

  @Post(':id/verify')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  @ApiOperation({ summary: 'Verify donation and issue official receipt' })
  async verify(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: { receivedAmountPaise?: number; notes?: string },
    @Ip() ip: string,
  ) {
    return this.donationsService.verifyDonation(id, adminId, dto, ip);
  }

  @Post(':id/reject')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  @ApiOperation({ summary: 'Reject donation with reason' })
  async reject(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('reason') reason: string,
    @Ip() ip: string,
  ) {
    return this.donationsService.rejectDonation(
      id,
      adminId,
      reason || 'Payment details could not be verified in bank records',
      ip,
    );
  }

  @Post(':id/void')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mark issued receipt as void' })
  async voidReceipt(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body('reason') reason: string,
    @Ip() ip: string,
  ) {
    return this.donationsService.voidReceipt(id, adminId, reason || 'Cancelled by admin', ip);
  }

  @Post('manual')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  @ApiOperation({ summary: 'Create manual offline donation' })
  async createManual(
    @CurrentUser('id') adminId: string,
    @Body() dto: any,
    @Ip() ip: string,
  ) {
    return this.donationsService.createManualDonation(adminId, dto, ip);
  }
}
