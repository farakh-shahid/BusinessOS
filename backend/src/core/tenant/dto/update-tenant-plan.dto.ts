import { IsIn } from "class-validator";
import { TENANT_PLANS, type TenantPlan } from "@business-os/shared";

export class UpdateTenantPlanDto {
  @IsIn([...TENANT_PLANS])
  plan!: TenantPlan;
}
