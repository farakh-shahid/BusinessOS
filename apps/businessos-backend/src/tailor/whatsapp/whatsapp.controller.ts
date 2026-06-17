import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { WhatsAppNotificationService } from "../../core/notifications/whatsapp-notification.service";
import { BaileysConnectionManager } from "../../core/whatsapp/baileys-connection.manager";
import { SendWhatsAppMessageDto } from "./dto/send-whatsapp-message.dto";

@Controller("tailor/whatsapp")
@UseGuards(JwtAuthGuard)
export class WhatsAppController {
  constructor(
    private readonly notifications: WhatsAppNotificationService,
    private readonly connections: BaileysConnectionManager,
  ) {}

  @Get("status")
  getStatus(@CurrentTenant() tenantId: string) {
    return this.connections.getStatus(tenantId);
  }

  @Post("send-message")
  sendMessage(
    @CurrentTenant() tenantId: string,
    @Body() dto: SendWhatsAppMessageDto,
  ) {
    return this.notifications.sendMessage(tenantId, dto.phone, dto.message);
  }
}
