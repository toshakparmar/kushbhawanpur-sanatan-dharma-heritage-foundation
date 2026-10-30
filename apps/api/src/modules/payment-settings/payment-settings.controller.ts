import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentSettingsService } from './payment-settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@kushbhawanpur/shared';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentSettingsController {
  constructor(private readonly service: PaymentSettingsService) {}

  @Get('payment-settings')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async getSettings() {
    return this.service.getSettings();
  }

  @Put('payment-settings')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async updateSettings(
    @CurrentUser() user: any,
    @Body() dto: any,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.service.updateSettings(user.id, dto, ip);
  }

  // UPI Accounts
  @Get('upi-accounts')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async getUpiAccounts() {
    return this.service.getUpiAccounts();
  }

  @Post('upi-accounts')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async createUpiAccount(
    @CurrentUser() user: any,
    @Body() dto: any,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.service.createUpiAccount(user.id, dto, ip);
  }

  @Put('upi-accounts/:id')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async updateUpiAccount(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.service.updateUpiAccount(user.id, id, dto, ip);
  }

  @Delete('upi-accounts/:id')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async deleteUpiAccount(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.service.deleteUpiAccount(user.id, id, ip);
  }

  // Bank Accounts
  @Get('bank-accounts')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async getBankAccounts() {
    return this.service.getBankAccounts();
  }

  @Post('bank-accounts')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async createBankAccount(
    @CurrentUser() user: any,
    @Body() dto: any,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.service.createBankAccount(user.id, dto, ip);
  }

  @Put('bank-accounts/:id')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async updateBankAccount(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.service.updateBankAccount(user.id, id, dto, ip);
  }

  @Delete('bank-accounts/:id')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async deleteBankAccount(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.service.deleteBankAccount(user.id, id, ip);
  }
}
