import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ReconciliationService } from './reconciliation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@kushbhawanpur/shared';

@Controller('admin/reconciliation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReconciliationController {
  constructor(private readonly reconService: ReconciliationService) {}

  @Post('import')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  @UseInterceptors(FileInterceptor('file'))
  async importStatement(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Bank statement CSV file is required.');
    }
    const csvContent = file.buffer.toString('utf-8');
    return this.reconService.matchStatement(csvContent);
  }

  @Post('bulk-verify')
  @Roles(Role.SUPER_ADMIN, Role.ACCOUNTS)
  async bulkVerify(
    @CurrentUser() user: any,
    @Body() dto: { donationIds: string[] },
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString();
    return this.reconService.bulkVerify(user.id, dto.donationIds, ip);
  }
}
