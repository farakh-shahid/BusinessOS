import type { StaffMember } from "@shared";
import { apiFetch } from "@/core/infrastructure/api/api-client";

export interface CreateStaffPayload {
  name: string;
  email?: string;
  phone?: string;
  phone2?: string;
  password: string;
  role: "STAFF" | "TAILOR";
  specialty?: string;
}

export interface UpdateStaffPayload {
  name: string;
  role: "STAFF" | "TAILOR";
  specialty?: string;
  phone?: string;
  phone2?: string;
}

export function fetchStaff() {
  return apiFetch<StaffMember[]>("/tailor/staff");
}

export function createStaff(payload: CreateStaffPayload) {
  return apiFetch<StaffMember>("/tailor/staff", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateStaff(staffId: string, payload: UpdateStaffPayload) {
  return apiFetch<StaffMember>(`/tailor/staff/${staffId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function setStaffPassword(staffId: string, password: string) {
  return apiFetch<{ updated: boolean }>(`/tailor/staff/${staffId}/password`, {
    method: "PATCH",
    body: JSON.stringify({ password }),
  });
}

export function revokeStaffAccess(staffId: string) {
  return apiFetch<{ revoked: boolean }>(`/tailor/staff/${staffId}`, {
    method: "DELETE",
  });
}
