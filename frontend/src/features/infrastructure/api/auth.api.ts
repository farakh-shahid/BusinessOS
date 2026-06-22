import { apiFetch } from "@/core/infrastructure/api/api-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  phone2?: string | null;
  role: string;
  specialty?: string | null;
  tenantId: string | null;
  tenantName: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export function loginRequest(login: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ login, password }),
    auth: false,
  });
}

export function signupRequest(payload: {
  shopName: string;
  name: string;
  phone: string;
  password: string;
}) {
  return apiFetch<LoginResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: false,
  });
}

export function meRequest() {
  return apiFetch<AuthUser>("/auth/me");
}

export function updateProfileRequest(payload: {
  name: string;
  specialty?: string;
  phone?: string;
  phone2?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  return apiFetch<AuthUser>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
