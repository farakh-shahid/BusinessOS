import { Module } from "@nestjs/common";
import { RolesGuard } from "../../core/auth/roles.guard";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsRepository } from "./analytics.repository";
import { AnalyticsService } from "./analytics.service";

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository, RolesGuard],
})
export class AnalyticsModule {}
