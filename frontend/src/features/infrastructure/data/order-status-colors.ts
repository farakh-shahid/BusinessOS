import type { OrderStatus, OrderWorkflowStatus } from "@shared";

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
  { badge: string; avatar: string; stripe: string }
> = {
  pending: {
    badge: "border-2 border-status-booked bg-status-booked-bg text-status-booked",
    avatar: "bg-status-booked-bg text-status-booked ring-2 ring-status-booked/80",
    stripe: "md:border-l-[5px] md:border-l-status-booked",
  },
  cutting: {
    badge: "border-2 border-status-cutting bg-status-cutting-bg text-[#9A6800]",
    avatar: "bg-status-cutting-bg text-[#9A6800] ring-2 ring-status-cutting/80",
    stripe: "md:border-l-[5px] md:border-l-status-cutting",
  },
  stitching: {
    badge: "border-2 border-status-stitching bg-status-stitching-bg text-status-stitching",
    avatar:
      "bg-status-stitching-bg text-status-stitching ring-2 ring-status-stitching/80",
    stripe: "md:border-l-[5px] md:border-l-status-stitching",
  },
  ready: {
    badge: "border-2 border-status-ready bg-status-ready-bg text-status-ready",
    avatar: "bg-status-ready-bg text-status-ready ring-2 ring-status-ready/80",
    stripe: "md:border-l-[5px] md:border-l-status-ready",
  },
  delivered: {
    badge: "border-2 border-status-ready bg-status-ready-bg text-status-ready",
    avatar: "bg-status-ready-bg text-status-ready ring-2 ring-status-ready/80",
    stripe: "md:border-l-[5px] md:border-l-status-ready",
  },
  overdue: {
    badge: "border-2 border-status-urgent bg-status-urgent-bg text-status-urgent",
    avatar: "bg-status-urgent-bg text-status-urgent ring-2 ring-status-urgent/80",
    stripe: "md:border-l-[5px] md:border-l-status-urgent",
  },
  cancelled: {
    badge: "border-2 border-muted-slate/40 bg-slate-100 text-muted-slate",
    avatar: "bg-slate-100 text-muted-slate ring-2 ring-muted-slate/50",
    stripe: "md:border-l-[5px] md:border-l-muted-slate",
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

export function statusStripeClass(
  _options: {
    displayStatus?: OrderStatus | string;
    workflowStatus?: OrderWorkflowStatus;
  },
  _isRtl = false,
): string {
  return "";
}
