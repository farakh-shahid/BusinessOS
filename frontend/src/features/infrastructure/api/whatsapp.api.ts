import type { WhatsAppConnectionState } from "@shared";
import { apiFetch } from "@/core/infrastructure/api/api-client";

export interface WhatsAppSendMessageResult {
  sent: boolean;
  method?: "baileys" | "meta_cloud" | "twilio" | "wa_me_link";
  whatsappUrl?: string;
  reason?: string;
}

export function fetchWhatsAppStatus() {
  return apiFetch<WhatsAppConnectionState>("/tailor/whatsapp/status");
}

export function sendWhatsAppMessage(phone: string, message: string) {
  return apiFetch<WhatsAppSendMessageResult>("/tailor/whatsapp/send-message", {
    method: "POST",
    body: JSON.stringify({ phone, message }),
  });
}
