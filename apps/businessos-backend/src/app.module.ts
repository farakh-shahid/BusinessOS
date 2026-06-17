import { Module } from "@nestjs/common";
import { AuthModule } from "./core/auth/auth.module";
import { NotificationModule } from "./core/notifications/notification.module";
import { PrismaModule } from "./core/database/prisma.module";
import { HealthModule } from "./core/health/health.module";
import { TenantModule } from "./core/tenant/tenant.module";
import { WhatsAppModule } from "./core/whatsapp/whatsapp.module";
import { TailorModule } from "./tailor/tailor.module";

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    TenantModule,
    WhatsAppModule,
    NotificationModule,
    TailorModule,
  ],
})
export class AppModule {}
