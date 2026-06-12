import { apiFetch } from "@/core/infrastructure/api/api-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
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

export function meRequest() {
  return apiFetch<AuthUser>("/auth/me");
}
