import type { StaffMember } from "@business-os/tailor";
import { apiFetch } from "@/core/infrastructure/api/api-client";

export interface CreateStaffPayload {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role: "ADMIN" | "STAFF" | "TAILOR";
}

export interface UpdateStaffPayload {
  name: string;
  role: "ADMIN" | "STAFF" | "TAILOR";
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

export function revokeStaffAccess(staffId: string) {
  return apiFetch<{ revoked: boolean }>(`/tailor/staff/${staffId}`, {
    method: "DELETE",
  });
}
