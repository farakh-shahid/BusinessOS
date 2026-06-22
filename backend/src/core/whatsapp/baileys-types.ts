import type { AuthenticationCreds } from "@whiskeysockets/baileys";

export type WhatsAppRuntimeStatus =
  | "disconnected"
  | "connecting"
  | "qr"
  | "connected";

export interface WhatsAppSessionStore {
  creds: AuthenticationCreds;
  keys: Record<string, unknown>;
}

export interface WhatsAppConnectionView {
  status: WhatsAppRuntimeStatus;
  phone?: string;
  qrDataUrl?: string;
  lastError?: string;
}
