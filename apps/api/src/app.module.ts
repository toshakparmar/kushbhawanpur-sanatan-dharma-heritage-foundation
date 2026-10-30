import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { PublicModule } from './modules/public/public.module';
import { DonationsModule } from './modules/donations/donations.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { PaymentSettingsModule } from './modules/payment-settings/payment-settings.module';
import { SevasModule } from './modules/sevas/sevas.module';
import { TeamModule } from './modules/team/team.module';
import { CertificationsModule } from './modules/certifications/certifications.module';
import { VideosModule } from './modules/videos/videos.module';
import { MilestonesModule } from './modules/milestones/milestones.module';
import { DonorsModule } from './modules/donors/donors.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { UsersModule } from './modules/users/users.module';
import { AuditModule } from './modules/audit/audit.module';
import { MediaModule } from './modules/media/media.module';
import { AuditService } from './common/services/audit.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    PublicModule,
    DonationsModule,
    OrganizationModule,
    PaymentSettingsModule,
    SevasModule,
    TeamModule,
    CertificationsModule,
    VideosModule,
    MilestonesModule,
    DonorsModule,
    ReceiptsModule,
    ReconciliationModule,
    UsersModule,
    AuditModule,
    MediaModule,
  ],
  providers: [AuditService],
})
export class AppModule {}
