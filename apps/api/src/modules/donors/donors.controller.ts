import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { DonorsService } from './donors.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@kushbhawanpur/shared';

@Controller('admin/donors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async findAll(@Query() query: any) {
    return this.donorsService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async findOne(@Param('id') id: string) {
    return this.donorsService.findOne(id);
  }

  @Post(':id/anonymize')
  @Roles(Role.SUPER_ADMIN)
  async anonymize(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.donorsService.anonymize(user.id, id, ip);
  }
}
