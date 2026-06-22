import { Injectable, Logger } from "@nestjs/common";
import {
  isTwilioWhatsAppConfigured,
  isWhatsAppCloudConfigured,
  notificationConfig,
} from "../../config/notification.config";
import { BaileysConnectionManager } from "../whatsapp/baileys-connection.manager";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  normalizePhoneForWhatsApp,
  type ReadyNotificationContext,
} from "./notification.templates";

export type WhatsAppSendMethod =
  | "baileys"
  | "meta_cloud"
  | "twilio"
  | "wa_me_link";

export interface WhatsAppSendResult {
  sent: boolean;
  method: WhatsAppSendMethod;
  whatsappUrl: string;
  reason?: string;
}

@Injectable()
export class WhatsAppNotificationService {
  private readonly logger = new Logger(WhatsAppNotificationService.name);

  constructor(private readonly baileys: BaileysConnectionManager) {}

  async sendMessage(
    tenantId: string,
    phone: string,
    message: string,
    template?: { name: string; bodyParams: string[] },
  ): Promise<WhatsAppSendResult> {
    const whatsappUrl = buildWhatsAppUrl(phone, message);

    if (this.baileys.isConnected(tenantId)) {
      try {
        await this.baileys.sendText(tenantId, phone, message);
        return { sent: true, method: "baileys", whatsappUrl };
      } catch (error) {
        this.logger.warn(
          "Baileys WhatsApp send failed, trying next provider",
          error,
        );
      }
    }

    if (isWhatsAppCloudConfigured()) {
      try {
        await this.sendViaMetaCloud(phone, message, template);
        return { sent: true, method: "meta_cloud", whatsappUrl };
      } catch (error) {
        this.logger.warn(
          "Meta WhatsApp Cloud API failed, trying next provider",
          error,
        );
      }
    }

    if (isTwilioWhatsAppConfigured()) {
      try {
        await this.sendViaTwilio(phone, message);
        return { sent: true, method: "twilio", whatsappUrl };
      } catch (error) {
        this.logger.error("Twilio WhatsApp failed, falling back to wa.me link", error);
      }
    }

    return {
      sent: false,
      method: "wa_me_link",
      whatsappUrl,
      reason: "open_whatsapp_to_send",
    };
  }

  async sendReadyNotification(
    tenantId: string,
    phone: string,
    ctx: ReadyNotificationContext,
  ): Promise<WhatsAppSendResult> {
    const message = buildWhatsAppMessage(ctx);
    const template = notificationConfig.whatsappCloud.readyTemplate
      ? {
          name: notificationConfig.whatsappCloud.readyTemplate,
          bodyParams: [
            ctx.customerName,
            ctx.garmentLabel,
            ctx.orderNumber,
            ctx.shopName,
          ],
        }
      : undefined;

    return this.sendMessage(tenantId, phone, message, template);
  }

  async sendDocument(params: {
    tenantId: string;
    phone: string;
    caption: string;
    filename: string;
    fallbackMessage: string;
    pdfBuffer: Buffer;
  }): Promise<WhatsAppSendResult> {
    const whatsappUrl = buildWhatsAppUrl(params.phone, params.fallbackMessage);

    if (this.baileys.isConnected(params.tenantId)) {
      try {
        await this.baileys.sendDocument(
          params.tenantId,
          params.phone,
          params.pdfBuffer,
          params.filename,
          params.caption,
        );
        return { sent: true, method: "baileys", whatsappUrl };
      } catch (error) {
        this.logger.warn(
          "Baileys WhatsApp document send failed, trying next provider",
          error,
        );
      }
    }

    if (isWhatsAppCloudConfigured()) {
      try {
        const mediaId = await this.uploadMetaWhatsAppMedia(
          params.pdfBuffer,
          params.filename,
        );
        await this.sendDocumentViaMetaCloud({
          phone: params.phone,
          caption: params.caption,
          mediaId,
          filename: params.filename,
        });
        return { sent: true, method: "meta_cloud", whatsappUrl };
      } catch (error) {
        this.logger.warn(
          "Meta WhatsApp document send failed, falling back to client share",
          error,
        );
      }
    }

    return {
      sent: false,
      method: "wa_me_link",
      whatsappUrl,
      reason: "attach_pdf_locally",
    };
  }

  private async uploadMetaWhatsAppMedia(
    pdfBuffer: Buffer,
    filename: string,
  ): Promise<string> {
    const { token, phoneNumberId, apiVersion } = notificationConfig.whatsappCloud;
    const form = new FormData();
    form.append("messaging_product", "whatsapp");
    form.append(
      "file",
      new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" }),
      filename,
    );

    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/media`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Meta media upload failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as { id?: string };
    if (!json.id) {
      throw new Error("Meta media upload response missing id");
    }

    return json.id;
  }

  private async sendDocumentViaMetaCloud(params: {
    phone: string;
    caption: string;
    mediaId: string;
    filename: string;
  }) {
    const { token, phoneNumberId, apiVersion } = notificationConfig.whatsappCloud;
    const to = normalizePhoneForWhatsApp(params.phone);
    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "document",
      document: {
        id: params.mediaId,
        filename: params.filename,
        caption: params.caption,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Meta WhatsApp Cloud API error: ${response.status} ${text}`);
    }
  }

  private async sendViaMetaCloud(
    phone: string,
    message: string,
    template?: { name: string; bodyParams: string[] },
  ) {
    const { token, phoneNumberId, apiVersion } = notificationConfig.whatsappCloud;
    const to = normalizePhoneForWhatsApp(phone);
    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    const payload = template?.name
      ? {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "template",
          template: {
            name: template.name,
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: template.bodyParams.map((text) => ({
                  type: "text",
                  text,
                })),
              },
            ],
          },
        }
      : {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: { body: message },
        };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Meta WhatsApp Cloud API error: ${response.status} ${text}`);
    }
  }

  private async sendViaTwilio(phone: string, message: string) {
    const normalized = normalizePhoneForWhatsApp(phone);
    const to = `whatsapp:+${normalized}`;
    const from = notificationConfig.twilio.whatsappFrom.startsWith("whatsapp:")
      ? notificationConfig.twilio.whatsappFrom
      : `whatsapp:${notificationConfig.twilio.whatsappFrom}`;

    const auth = Buffer.from(
      `${notificationConfig.twilio.accountSid}:${notificationConfig.twilio.authToken}`,
    ).toString("base64");

    const body = new URLSearchParams({
      To: to,
      From: from,
      Body: message,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${notificationConfig.twilio.accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Twilio error: ${response.status} ${text}`);
    }
  }
}
