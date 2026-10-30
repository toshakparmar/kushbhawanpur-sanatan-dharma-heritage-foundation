import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../common/services/storage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@kushbhawanpur/shared';

@Controller('admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT, Role.ACCOUNTS)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file format: ${file.mimetype}. Allowed: JPG, PNG, WEBP, SVG, PDF.`,
      );
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('File size must not exceed 5 MB.');
    }

    const stored = await this.storageService.saveBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      { folder: 'uploads' },
    );

    return {
      url: stored.url,
      key: stored.key,
      size: stored.size,
      mimeType: stored.mimeType,
    };
  }
}
