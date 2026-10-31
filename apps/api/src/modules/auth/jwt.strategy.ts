import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

interface CachedAdmin {
  user: any;
  cachedAt: number;
}

const userCache = new Map<string, CachedAdmin>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['auth_token'];
          }
          if (!token && request.headers.authorization) {
            const parts = request.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
              token = parts[1];
            }
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'dev-jwt-secret-kushbhawanpur-2026'),
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const now = Date.now();
    const cached = userCache.get(payload.sub);
    if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
      if (!cached.user.active) {
        throw new UnauthorizedException('User account is inactive or not found.');
      }
      return cached.user;
    }

    try {
      const user = await this.prisma.adminUser.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
          mustChangePassword: true,
          active: true,
        },
      });

      if (!user || !user.active) {
        userCache.delete(payload.sub);
        throw new UnauthorizedException('User account is inactive or not found.');
      }

      userCache.set(payload.sub, { user, cachedAt: now });
      return user;
    } catch (err: any) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      // If DB has a transient network timeout, serve from recent cache if available
      if (cached && cached.user?.active) {
        return cached.user;
      }
      throw new UnauthorizedException('Authentication database connection timed out. Please retry.');
    }
  }
}
