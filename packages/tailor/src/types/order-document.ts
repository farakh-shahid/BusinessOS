export type OrderDocumentType = "receipt" | "measurements";

export interface OrderDocumentWhatsAppResult {
  sent: boolean;
  method?: "baileys" | "meta_cloud" | "twilio" | "wa_me_link" | "client_share";
  whatsappUrl?: string;
  reason?: string;
}
