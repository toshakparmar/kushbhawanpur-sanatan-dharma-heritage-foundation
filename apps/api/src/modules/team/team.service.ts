import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { TeamMemberType } from '@kushbhawanpur/shared';

@Injectable()
export class TeamService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.teamMember.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    return this.prisma.teamMember.findUnique({
      where: { id },
    });
  }

  async create(adminId: string, dto: any, ip?: string) {
    const member = await this.prisma.teamMember.create({
      data: {
        type: dto.type || TeamMemberType.VOLUNTEER,
        nameEn: dto.nameEn,
        nameHi: dto.nameHi || null,
        designation: dto.designation,
        photoUrl: dto.photoUrl || null,
        bio: dto.bio || null,
        socialLinks: dto.socialLinks || dto.socials || null,
        sortOrder: Number(dto.sortOrder ?? dto.sort) || 0,
        active: dto.active !== undefined ? Boolean(dto.active) : true,
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'TEAM_MEMBER_CREATED',
      entity: 'TeamMember',
      entityId: member.id,
      meta: { name: member.nameEn, type: member.type },
      ip,
    });

    return member;
  }

  async update(adminId: string, id: string, dto: any, ip?: string) {
    const updated = await this.prisma.teamMember.update({
      where: { id },
      data: {
        ...(dto.type && { type: dto.type }),
        ...(dto.nameEn && { nameEn: dto.nameEn }),
        ...(dto.nameHi !== undefined && { nameHi: dto.nameHi }),
        ...(dto.designation && { designation: dto.designation }),
        ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...((dto.socialLinks !== undefined || dto.socials !== undefined) && {
          socialLinks: dto.socialLinks || dto.socials,
        }),
        ...((dto.sortOrder !== undefined || dto.sort !== undefined) && {
          sortOrder: Number(dto.sortOrder ?? dto.sort),
        }),
        ...(dto.active !== undefined && { active: Boolean(dto.active) }),
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'TEAM_MEMBER_UPDATED',
      entity: 'TeamMember',
      entityId: id,
      ip,
    });

    return updated;
  }

  async delete(adminId: string, id: string, ip?: string) {
    const deleted = await this.prisma.teamMember.delete({
      where: { id },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'TEAM_MEMBER_DELETED',
      entity: 'TeamMember',
      entityId: id,
      ip,
    });

    return deleted;
  }
}
