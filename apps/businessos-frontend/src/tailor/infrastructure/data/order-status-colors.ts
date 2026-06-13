import type { OrderStatus, OrderWorkflowStatus } from "@business-os/tailor";

export type StatusColorKey =
  | "pending"
  | "cutting"
  | "stitching"
  | "ready"
  | "delivered"
  | "overdue"
  | "cancelled";

export const statusColorClasses: Record<
  StatusColorKey,
  { badge: string; avatar: string }
> = {
  pending: {
    badge: "border-2 border-status-booked bg-status-booked-bg text-status-booked",
    avatar: "bg-status-booked-bg text-status-booked ring-2 ring-status-booked/80",
  },
  cutting: {
    badge: "border-2 border-status-cutting bg-status-cutting-bg text-[#9A6800]",
    avatar: "bg-status-cutting-bg text-[#9A6800] ring-2 ring-status-cutting/80",
  },
  stitching: {
    badge: "border-2 border-status-stitching bg-status-stitching-bg text-status-stitching",
    avatar:
      "bg-status-stitching-bg text-status-stitching ring-2 ring-status-stitching/80",
  },
  ready: {
    badge: "border-2 border-status-ready bg-status-ready-bg text-status-ready",
    avatar: "bg-status-ready-bg text-status-ready ring-2 ring-status-ready/80",
  },
  delivered: {
    badge:
      "border-2 border-status-delivered bg-status-delivered-bg text-status-delivered",
    avatar:
      "bg-status-delivered-bg text-status-delivered ring-2 ring-status-delivered/80",
  },
  overdue: {
    badge: "border-2 border-status-urgent bg-status-urgent-bg text-status-urgent",
    avatar: "bg-status-urgent-bg text-status-urgent ring-2 ring-status-urgent/80",
  },
  cancelled: {
    badge:
      "border-2 border-status-delivered/70 bg-status-delivered-bg text-status-delivered",
    avatar:
      "bg-status-delivered-bg text-status-delivered ring-2 ring-status-delivered/60",
  },
};

export const displayStatusColorKey: Record<OrderStatus, StatusColorKey> = {
  pending: "pending",
  cutting: "cutting",
  stitching: "stitching",
  due_today: "cutting",
  overdue: "overdue",
  ready: "ready",
  delivered: "delivered",
  cancelled: "cancelled",
};

const workflowStatusColorKey: Record<OrderWorkflowStatus, StatusColorKey> = {
  pending: "pending",
  cutting: "cutting",
  stitching: "stitching",
  ready: "ready",
  delivered: "delivered",
  cancelled: "cancelled",
};

export function resolveWorkflowColorKey(
  workflowStatus?: OrderWorkflowStatus,
): StatusColorKey {
  if (!workflowStatus) return "pending";
  return workflowStatusColorKey[workflowStatus];
}

export function statusBadgeClass(options: {
  displayStatus?: OrderStatus | string;
  workflowStatus?: OrderWorkflowStatus;
}): string {
  return statusColorClasses[resolveWorkflowColorKey(options.workflowStatus)]
    .badge;
}

export function statusAvatarClass(status: OrderStatus): string {
  return statusColorClasses[displayStatusColorKey[status]].avatar;
}
