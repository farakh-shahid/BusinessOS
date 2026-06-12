import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { UpdateTenantSettingsDto } from "./dto/update-tenant-settings.dto";
import { SettingsService } from "./settings.service";

@Controller("tailor/settings")
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get(@CurrentTenant() tenantId: string) {
    return this.settings.get(tenantId);
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  update(
    @CurrentTenant() tenantId: string,
    @Body() dto: UpdateTenantSettingsDto,
  ) {
    return this.settings.update(tenantId, dto);
  }
}
