import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VideoUrlParser } from '../../common/services/video-url.parser';
import { AuditService } from '../../common/services/audit.service';

@Injectable()
export class VideosService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.video.findMany({
      orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    return this.prisma.video.findUnique({
      where: { id },
    });
  }

  async create(adminId: string, dto: any, ip?: string) {
    // Parse URL safely
    const parsed = VideoUrlParser.parse(dto.sourceUrl);

    // If marked featured, unmark other featured videos
    if (dto.featured) {
      await this.prisma.video.updateMany({
        data: { featured: false },
      });
    }

    const video = await this.prisma.video.create({
      data: {
        title: dto.title.trim(),
        sourceUrl: dto.sourceUrl.trim(),
        provider: parsed.provider,
        videoId: parsed.videoId,
        embedUrl: parsed.embedUrl,
        thumbnailUrl: dto.thumbnailUrl || parsed.thumbnailUrl || null,
        description: dto.description?.trim() || null,
        category: dto.category?.trim() || 'General',
        featured: Boolean(dto.featured),
        sort: Number(dto.sort) || 0,
        published: dto.published !== undefined ? Boolean(dto.published) : true,
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'VIDEO_CREATED',
      entity: 'Video',
      entityId: video.id,
      meta: { title: video.title, provider: video.provider },
      ip,
    });

    return video;
  }

  async update(adminId: string, id: string, dto: any, ip?: string) {
    let parsedFields = {};
    if (dto.sourceUrl) {
      const parsed = VideoUrlParser.parse(dto.sourceUrl);
      parsedFields = {
        sourceUrl: dto.sourceUrl.trim(),
        provider: parsed.provider,
        videoId: parsed.videoId,
        embedUrl: parsed.embedUrl,
        thumbnailUrl: dto.thumbnailUrl || parsed.thumbnailUrl,
      };
    }

    if (dto.featured) {
      await this.prisma.video.updateMany({
        where: { id: { not: id } },
        data: { featured: false },
      });
    }

    const updated = await this.prisma.video.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title.trim() }),
        ...parsedFields,
        ...(dto.thumbnailUrl !== undefined && { thumbnailUrl: dto.thumbnailUrl }),
        ...(dto.description !== undefined && { description: dto.description?.trim() || null }),
        ...(dto.category && { category: dto.category.trim() }),
        ...(dto.featured !== undefined && { featured: Boolean(dto.featured) }),
        ...(dto.sort !== undefined && { sort: Number(dto.sort) }),
        ...(dto.published !== undefined && { published: Boolean(dto.published) }),
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'VIDEO_UPDATED',
      entity: 'Video',
      entityId: id,
      ip,
    });

    return updated;
  }

  async delete(adminId: string, id: string, ip?: string) {
    const deleted = await this.prisma.video.delete({
      where: { id },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'VIDEO_DELETED',
      entity: 'Video',
      entityId: id,
      ip,
    });

    return deleted;
  }
}
