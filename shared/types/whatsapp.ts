export type WhatsAppConnectionStatus =
  | "disconnected"
  | "connecting"
  | "qr"
  | "connected";

export interface WhatsAppConnectionState {
  status: WhatsAppConnectionStatus;
  phone?: string;
  qrDataUrl?: string;
  lastError?: string;
}
