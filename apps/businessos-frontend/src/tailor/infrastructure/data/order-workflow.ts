import type { OrderWorkflowStatus } from "@business-os/tailor";
import {
  canDeliverOrders,
  isAdminRole,
  isStaffRole,
  isTailorRole,
} from "@/core/auth/roles";

export const STAFF_WORKFLOW_STATUSES: OrderWorkflowStatus[] = [
  "pending",
  "cutting",
  "stitching",
  "ready",
];

export const STAFF_DELIVER_WORKFLOW_STATUSES: OrderWorkflowStatus[] = [
  ...STAFF_WORKFLOW_STATUSES,
  "delivered",
];

export const ADMIN_WORKFLOW_STATUSES: OrderWorkflowStatus[] = [
  ...STAFF_WORKFLOW_STATUSES,
  "delivered",
  "cancelled",
];

export function workflowOptionsForRole(
  role?: string | null,
): OrderWorkflowStatus[] {
  if (isAdminRole(role)) return ADMIN_WORKFLOW_STATUSES;
  if (canDeliverOrders(role)) return STAFF_DELIVER_WORKFLOW_STATUSES;
  return STAFF_WORKFLOW_STATUSES;
}

export function canEditOrderStatus(
  workflowStatus: OrderWorkflowStatus,
  role?: string | null,
): boolean {
  if (workflowStatus === "cancelled") return isAdminRole(role);
  if (workflowStatus === "delivered") return canDeliverOrders(role);
  return isAdminRole(role) || isTailorRole(role) || isStaffRole(role);
}
