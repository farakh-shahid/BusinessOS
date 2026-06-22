import type { TenantSettings, WhatsAppConnectionState } from "@shared";
import { apiFetch } from "@/core/infrastructure/api/api-client";

export function fetchSettings() {
  return apiFetch<TenantSettings>("/tailor/settings");
}

export function updateSettings(payload: Partial<TenantSettings>) {
  return apiFetch<TenantSettings>("/tailor/settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function fetchWhatsAppConnection() {
  return apiFetch<WhatsAppConnectionState>("/tailor/settings/whatsapp");
}

export function connectWhatsApp() {
  return apiFetch<WhatsAppConnectionState>("/tailor/settings/whatsapp/connect", {
    method: "POST",
  });
}

export function disconnectWhatsApp() {
  return apiFetch<WhatsAppConnectionState>("/tailor/settings/whatsapp", {
    method: "DELETE",
  });
}
