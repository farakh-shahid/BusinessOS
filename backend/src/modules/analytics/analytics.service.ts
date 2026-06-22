import { Injectable } from "@nestjs/common";
import { AnalyticsRepository } from "./analytics.repository";
import type { AnalyticsQueryDto } from "./dto/analytics-query.dto";

@Injectable()
export class AnalyticsService {
  constructor(private readonly analytics: AnalyticsRepository) {}

  getOverview(tenantId: string, query: AnalyticsQueryDto) {
    return this.analytics.getOverview(tenantId, query);
  }
}
