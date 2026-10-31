import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../common/services/storage.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@kushbhawanpur/shared';

@Controller('admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.CONTENT, Role.ACCOUNTS)
  async getMediaLibrary(
    @Query('kind') kind?: string,
    @Query('search') search?: string,
    @Query('unusedOnly') unusedOnly?: string,
  ) {
    const where: any = {
      deletedAt: null,
      ...(kind && { kind }),
      ...(search && {
        OR: [
          { originalName: { contains: search, mode: 'insensitive' } },
          { alt: { contains: search, mode: 'insensitive' } },
          { caption: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    if (unusedOnly === 'true') {
      where.usages = { none: {} };
    }

    const assets = await this.prisma.mediaAsset.findMany({
      where,
      include: {
        _count: {
          select: { usages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return assets.map((a) => ({
      ...a,
      usageCount: a._count.usages,
    }));
  }

  @Post('upload')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT, Role.ACCOUNTS)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('alt') alt?: string,
    @Body('caption') caption?: string,
    @Req() req?: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file format: ${file.mimetype}. Allowed: JPG, PNG, WEBP, SVG, PDF, DOC, DOCX.`,
      );
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10 MB limit
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('File size must not exceed 10 MB.');
    }

    const isDoc = file.mimetype.includes('pdf') || file.mimetype.includes('word');
    const kind = isDoc ? 'DOCUMENT' : 'IMAGE';

    const stored = await this.storageService.saveBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      { folder: kind === 'DOCUMENT' ? 'documents' : 'uploads' },
    );

    // Save record to database
    const asset = await this.prisma.mediaAsset.create({
      data: {
        kind,
        originalName: file.originalname,
        mime: file.mimetype,
        sizeBytes: file.size,
        storageKey: stored.key,
        url: stored.url,
        alt: alt || file.originalname.replace(/\.[^/.]+$/, ''),
        caption: caption || '',
        status: 'ATTACHED',
        uploadedById: req?.user?.id || null,
      },
    });

    return {
      id: asset.id,
      url: asset.url,
      key: asset.storageKey,
      size: asset.sizeBytes,
      mimeType: asset.mime,
      kind: asset.kind,
      alt: asset.alt,
      caption: asset.caption,
    };
  }

  @Get(':id/usage')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT, Role.ACCOUNTS)
  async getAssetUsage(@Param('id') id: string) {
    const usages = await this.prisma.mediaUsage.findMany({
      where: { assetId: id },
    });
    return usages;
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async updateAsset(
    @Param('id') id: string,
    @Body() dto: { alt?: string; caption?: string; originalName?: string },
  ) {
    return this.prisma.mediaAsset.update({
      where: { id },
      data: dto,
    });
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async deleteAsset(
    @Param('id') id: string,
    @Query('force') force?: string,
  ) {
    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id },
      include: { usages: true },
    });
    if (!asset) {
      throw new NotFoundException('Media asset not found.');
    }

    if (asset.usages.length > 0 && force !== 'true') {
      throw new ConflictException({
        code: 'MEDIA_IN_USE',
        message: `This media asset is currently used in ${asset.usages.length} place(s).`,
        usages: asset.usages,
      });
    }

    // Soft delete media asset
    return this.prisma.mediaAsset.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'TRASHED' },
    });
  }
}
