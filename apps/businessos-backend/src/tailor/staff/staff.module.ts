import { Module } from "@nestjs/common";
import { RolesGuard } from "../../core/auth/roles.guard";
import { StaffController } from "./staff.controller";
import { StaffService } from "./staff.service";

@Module({
  controllers: [StaffController],
  providers: [StaffService, RolesGuard],
})
export class StaffModule {}
