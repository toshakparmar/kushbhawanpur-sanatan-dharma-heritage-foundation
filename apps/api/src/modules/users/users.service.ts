import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        mustChangePassword: true,
        active: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(adminId: string, dto: any, ip?: string) {
    const existing = await this.prisma.adminUser.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.adminUser.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        role: dto.role,
        mustChangePassword: true,
        active: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        mustChangePassword: true,
        active: true,
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'ADMIN_USER_CREATED',
      entity: 'AdminUser',
      entityId: user.id,
      meta: { email: user.email, role: user.role },
      ip,
    });

    return user;
  }

  async update(adminId: string, id: string, dto: any, ip?: string) {
    const data: any = {
      ...(dto.role && { role: dto.role }),
      ...(dto.active !== undefined && { active: Boolean(dto.active) }),
    };

    if (dto.password) {
      const salt = await bcrypt.genSalt(12);
      data.passwordHash = await bcrypt.hash(dto.password, salt);
      data.mustChangePassword = true;
    }

    const updated = await this.prisma.adminUser.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        mustChangePassword: true,
        active: true,
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'ADMIN_USER_UPDATED',
      entity: 'AdminUser',
      entityId: id,
      ip,
    });

    return updated;
  }
}
