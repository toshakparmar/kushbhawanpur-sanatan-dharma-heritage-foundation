import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@kushbhawanpur/shared';

@Controller('admin/receipts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async findAll(@Query() query: any) {
    return this.receiptsService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async findOne(@Param('id') id: string) {
    return this.receiptsService.findOne(id);
  }
}
