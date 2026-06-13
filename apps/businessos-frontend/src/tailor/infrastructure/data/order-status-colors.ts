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
  { badge: string; avatar: string; stripe: string }
> = {
  pending: {
    badge: "border-2 border-slate-400 bg-slate-200 text-slate-800",
    avatar: "bg-slate-200 text-slate-800 ring-2 ring-slate-400/80",
    stripe: "border-l-[5px] border-l-slate-400",
  },
  cutting: {
    badge: "border-2 border-amber-500 bg-amber-100 text-amber-950",
    avatar: "bg-amber-100 text-amber-950 ring-2 ring-amber-500/80",
    stripe: "border-l-[5px] border-l-amber-500",
  },
  stitching: {
    badge: "border-2 border-orange-500 bg-orange-100 text-orange-950",
    avatar: "bg-orange-100 text-orange-950 ring-2 ring-orange-500/80",
    stripe: "border-l-[5px] border-l-orange-500",
  },
  ready: {
    badge: "border-2 border-blue-600 bg-blue-100 text-blue-950",
    avatar: "bg-blue-100 text-blue-950 ring-2 ring-blue-600/80",
    stripe: "border-l-[5px] border-l-blue-600",
  },
  delivered: {
    badge: "border-2 border-green-600 bg-green-100 text-green-950",
    avatar: "bg-green-100 text-green-950 ring-2 ring-green-600/80",
    stripe: "border-l-[5px] border-l-green-600",
  },
  overdue: {
    badge: "border-2 border-red-600 bg-red-100 text-red-950",
    avatar: "bg-red-100 text-red-950 ring-2 ring-red-600/80",
    stripe: "border-l-[5px] border-l-red-600",
  },
  cancelled: {
    badge: "border-2 border-red-400 bg-red-50 text-red-800",
    avatar: "bg-red-50 text-red-700 ring-2 ring-red-400/80",
    stripe: "border-l-[5px] border-l-red-400",
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
  options: {
    displayStatus?: OrderStatus | string;
    workflowStatus?: OrderWorkflowStatus;
  },
  isRtl = false,
): string {
  const stripe =
    statusColorClasses[resolveWorkflowColorKey(options.workflowStatus)].stripe;
  if (!isRtl) return stripe;
  return stripe
    .replace("border-l-[5px]", "border-r-[5px]")
    .replace(/border-l-(\S+)/g, "border-r-$1");
}
