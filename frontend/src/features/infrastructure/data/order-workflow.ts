import type { OrderWorkflowStatus } from "@shared";
import { isAdminRole } from "@/core/auth/roles";

export const ADMIN_WORKFLOW_STATUSES: OrderWorkflowStatus[] = [
  "pending",
  "cutting",
  "stitching",
  "ready",
  "delivered",
  "cancelled",
];

export function workflowOptionsForRole(
  role?: string | null,
): OrderWorkflowStatus[] {
  if (isAdminRole(role)) return ADMIN_WORKFLOW_STATUSES;
  return [];
}

export function canEditOrderStatus(
  _workflowStatus: OrderWorkflowStatus,
  role?: string | null,
): boolean {
  return isAdminRole(role);
}

export function needsDeliveredReopenConfirm(
  current: OrderWorkflowStatus,
  next: OrderWorkflowStatus,
): boolean {
  return current === "delivered" && next !== "delivered";
}
