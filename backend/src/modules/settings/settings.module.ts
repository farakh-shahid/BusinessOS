import { Module } from "@nestjs/common";
import { RolesGuard } from "../../core/auth/roles.guard";
import { SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";
import { WhatsAppSettingsController } from "./whatsapp-settings.controller";

@Module({
  controllers: [SettingsController, WhatsAppSettingsController],
  providers: [SettingsService, RolesGuard],
  exports: [SettingsService],
})
export class SettingsModule {}
