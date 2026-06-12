export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";

export function isAdminRole(role?: string | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}
