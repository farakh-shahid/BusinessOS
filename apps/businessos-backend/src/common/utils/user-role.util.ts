import type { UserRole } from "../../generated/prisma/client";

export function isAdminRole(role: UserRole): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isStaffRole(role: UserRole): boolean {
  return role === "STAFF";
}

export function isTailorRole(role: UserRole): boolean {
  return role === "TAILOR";
}

/** Staff and tailor accounts — limited shop floor access (no settings / financials). */
export function isFloorRole(role: UserRole): boolean {
  return role === "STAFF" || role === "TAILOR";
}

export function canCreateOrders(role: UserRole): boolean {
  return isAdminRole(role) || isStaffRole(role);
}

export function canDeliverOrders(role: UserRole): boolean {
  return isAdminRole(role) || isStaffRole(role);
}

export function shouldHideFinancials(role: UserRole): boolean {
  return isFloorRole(role);
}

export function shouldScopeOrdersToAssignee(role: UserRole): boolean {
  return isTailorRole(role);
}

export function orderAssignedToUser(
  order: { assignedToName?: string | null },
  userName: string,
): boolean {
  const assignee = order.assignedToName?.trim().toLowerCase();
  const worker = userName.trim().toLowerCase();
  return Boolean(assignee && worker && assignee === worker);
}
