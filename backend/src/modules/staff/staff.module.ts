import { Module } from "@nestjs/common";
import { RolesGuard } from "../../core/auth/roles.guard";
import { TenantModule } from "../../core/tenant/tenant.module";
import { StaffController } from "./staff.controller";
import { StaffService } from "./staff.service";

@Module({
  imports: [TenantModule],
  controllers: [StaffController],
  providers: [StaffService, RolesGuard],
})
export class StaffModule {}
