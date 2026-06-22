import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { AnalyticsService } from "./analytics.service";
import { AnalyticsQueryDto } from "./dto/analytics-query.dto";

@Controller("tailor/analytics")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get()
  overview(
    @CurrentTenant() tenantId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analytics.getOverview(tenantId, query);
  }
}
