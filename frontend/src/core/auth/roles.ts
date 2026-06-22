export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "TAILOR";

export function isAdminRole(role?: string | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isStaffRole(role?: string | null): boolean {
  return role === "STAFF";
}

export function isTailorRole(role?: string | null): boolean {
  return role === "TAILOR";
}

/** Staff and tailor — limited shop floor access (no settings / financials). */
export function isFloorRole(role?: string | null): boolean {
  return isStaffRole(role) || isTailorRole(role);
}

export function canCreateOrders(role?: string | null): boolean {
  return isAdminRole(role) || isStaffRole(role);
}

export function canDeliverOrders(role?: string | null): boolean {
  return isAdminRole(role);
}

export function canChangeOrderStatus(role?: string | null): boolean {
  return isAdminRole(role);
}
