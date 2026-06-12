import type { TenantSettings } from "@business-os/tailor";
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
