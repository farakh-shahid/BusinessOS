import { Global, Module } from "@nestjs/common";
import { BaileysConnectionManager } from "./baileys-connection.manager";

@Global()
@Module({
  providers: [BaileysConnectionManager],
  exports: [BaileysConnectionManager],
})
export class WhatsAppModule {}
