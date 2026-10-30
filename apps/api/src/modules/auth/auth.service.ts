import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.active) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  async login(user: any, ip?: string) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    await this.auditService.log({
      actorId: user.id,
      action: 'ADMIN_LOGIN',
      entity: 'AdminUser',
      entityId: user.id,
      ip,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  async changePassword(userId: string, currentPass: string, newPass: string, ip?: string) {
    if (newPass.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long.');
    }

    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match.');
    }

    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPass, salt);

    await this.prisma.adminUser.update({
      where: { id: userId },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
      },
    });

    await this.auditService.log({
      actorId: userId,
      action: 'ADMIN_CHANGE_PASSWORD',
      entity: 'AdminUser',
      entityId: userId,
      ip,
    });

    return { success: true, message: 'Password changed successfully.' };
  }
}
