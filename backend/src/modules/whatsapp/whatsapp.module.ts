import { Module } from "@nestjs/common";
import { WhatsAppModule } from "../../core/whatsapp/whatsapp.module";
import { WhatsAppController } from "./whatsapp.controller";

@Module({
  imports: [WhatsAppModule],
  controllers: [WhatsAppController],
})
export class TailorWhatsAppModule {}
