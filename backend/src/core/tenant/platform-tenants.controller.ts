import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { UpdateTenantPlanDto } from "./dto/update-tenant-plan.dto";
import { TenantPlanService } from "./tenant-plan.service";

@Controller("platform/tenants")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN")
export class PlatformTenantsController {
  constructor(private readonly tenantPlans: TenantPlanService) {}

  @Patch(":id/plan")
  updatePlan(@Param("id") tenantId: string, @Body() dto: UpdateTenantPlanDto) {
    return this.tenantPlans.updateTenantPlan(tenantId, dto.plan);
  }
}
