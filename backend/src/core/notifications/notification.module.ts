import { Global, Module } from "@nestjs/common";
import { EmailNotificationService } from "./email-notification.service";
import { WhatsAppNotificationService } from "./whatsapp-notification.service";

@Global()
@Module({
  providers: [EmailNotificationService, WhatsAppNotificationService],
  exports: [EmailNotificationService, WhatsAppNotificationService],
})
export class NotificationModule {}
