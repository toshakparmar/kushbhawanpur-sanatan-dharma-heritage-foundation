import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('site')
  async getSite() {
    return this.publicService.getSiteContent();
  }

  @Get('donate-config')
  async getDonateConfig() {
    return this.publicService.getDonateConfig();
  }

  @Post('donations')
  async createDonation(@Body() dto: any) {
    return this.publicService.createDonation(dto);
  }

  @Post('donations/:ref/proof')
  @UseInterceptors(FileInterceptor('screenshot'))
  async submitProof(
    @Param('ref') refId: string,
    @Body() dto: { utr: string; paymentAt?: string; token?: string },
    @Headers('x-donor-token') headerToken?: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const token = dto.token || headerToken || '';
    return this.publicService.submitProof(refId, token, dto, file);
  }

  @Get('donations/:ref/status')
  async getStatus(
    @Param('ref') refId: string,
    @Query('contact') contact?: string,
    @Query('token') queryToken?: string,
    @Headers('x-donor-token') headerToken?: string,
  ) {
    const token = queryToken || headerToken;
    return this.publicService.getDonationStatus(refId, contact, token);
  }

  @Get('receipts/:receiptNo/verify')
  async verifyReceipt(@Param('receiptNo') receiptNo: string) {
    return this.publicService.verifyReceiptPublic(receiptNo);
  }

  @Post('reminders')
  async createReminder(@Body() dto: { email: string; sevaId?: string; dayOfMonth?: number }) {
    return this.publicService.createReminder(dto.email, dto.sevaId, dto.dayOfMonth);
  }
}
