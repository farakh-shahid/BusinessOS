import { Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { RolesGuard } from "../../core/auth/roles.guard";
import { BaileysConnectionManager } from "../../core/whatsapp/baileys-connection.manager";

@Controller("tailor/settings/whatsapp")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
export class WhatsAppSettingsController {
  constructor(private readonly whatsapp: BaileysConnectionManager) {}

  @Get()
  getStatus(@CurrentTenant() tenantId: string) {
    return this.whatsapp.getStatus(tenantId);
  }

  @Post("connect")
  async connect(@CurrentTenant() tenantId: string) {
    const current = this.whatsapp.getStatus(tenantId);
    if (current.status === "connected") {
      return current;
    }
    if (current.status === "connecting" || current.status === "qr") {
      return current;
    }
    await this.whatsapp.destroySession(tenantId, { logout: false });
    return this.whatsapp.startConnection(tenantId);
  }

  @Post("reset")
  async reset(@CurrentTenant() tenantId: string) {
    await this.whatsapp.destroySession(tenantId, { logout: false });
    return { status: "disconnected" as const };
  }

  @Delete()
  disconnect(@CurrentTenant() tenantId: string) {
    return this.whatsapp.disconnect(tenantId);
  }
}
