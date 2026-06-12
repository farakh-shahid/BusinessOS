import type { OrderWorkflowStatus } from "@business-os/tailor";

export const STAFF_WORKFLOW_STATUSES: OrderWorkflowStatus[] = [
  "pending",
  "cutting",
  "stitching",
  "ready",
];

export const ADMIN_WORKFLOW_STATUSES: OrderWorkflowStatus[] = [
  ...STAFF_WORKFLOW_STATUSES,
  "delivered",
  "cancelled",
];

export function workflowOptionsForRole(isAdmin: boolean): OrderWorkflowStatus[] {
  return isAdmin ? ADMIN_WORKFLOW_STATUSES : STAFF_WORKFLOW_STATUSES;
}

export function canEditOrderStatus(
  workflowStatus: OrderWorkflowStatus,
  isAdmin: boolean,
): boolean {
  if (isAdmin) return workflowStatus !== "cancelled";
  return !["delivered", "cancelled"].includes(workflowStatus);
}
