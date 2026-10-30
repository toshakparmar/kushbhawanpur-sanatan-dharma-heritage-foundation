import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@kushbhawanpur/shared';

@Controller('admin/team')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.CONTENT, Role.ACCOUNTS)
  async findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async create(
    @CurrentUser() user: any,
    @Body() dto: any,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.teamService.create(user.id, dto, ip);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.teamService.update(user.id, id, dto, ip);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async delete(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.teamService.delete(user.id, id, ip);
  }
}
