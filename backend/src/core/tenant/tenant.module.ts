import { Module } from "@nestjs/common";
import { PlatformTenantsController } from "./platform-tenants.controller";
import { TenantPlanService } from "./tenant-plan.service";

@Module({
  controllers: [PlatformTenantsController],
  providers: [TenantPlanService],
  exports: [TenantPlanService],
})
export class TenantModule {}
