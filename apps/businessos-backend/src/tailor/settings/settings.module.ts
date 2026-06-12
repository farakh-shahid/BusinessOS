import { Module } from "@nestjs/common";
import { RolesGuard } from "../../core/auth/roles.guard";
import { SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, RolesGuard],
  exports: [SettingsService],
})
export class SettingsModule {}
