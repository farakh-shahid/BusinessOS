"use client";

import type { OrderWorkflowStatus } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { statusBadgeClass } from "@/tailor/infrastructure/data/order-status-colors";

interface OrderWorkflowStatusBadgeProps {
  workflowStatus: OrderWorkflowStatus;
  t: Dictionary;
  className?: string;
  size?: "default" | "compact";
}

const COMPACT_STATUS_BADGE: Record<OrderWorkflowStatus, string> = {
  pending: "bg-status-booked-bg text-status-booked",
  cutting: "bg-status-cutting-bg text-[#9A6800]",
  stitching: "bg-status-stitching-bg text-status-stitching",
  ready: "bg-status-ready-bg text-status-ready",
  delivered: "bg-status-ready-bg text-status-ready",
  cancelled: "bg-slate-100 text-muted-slate",
};

function statusLabel(
  workflowStatus: OrderWorkflowStatus,
  t: Dictionary,
): string {
  return t.orderStatus[workflowStatus];
}

export function OrderWorkflowStatusBadge({
  workflowStatus,
  t,
  className,
  size = "default",
}: OrderWorkflowStatusBadgeProps) {
  const compact = size === "compact";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full",
        compact
          ? "gap-1 uppercase tracking-wide leading-none"
          : "gap-1.5 px-2.5 py-1 text-[11px] font-semibold",
        !compact && statusBadgeClass({ workflowStatus }),
        compact && COMPACT_STATUS_BADGE[workflowStatus],
        className,
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded-full",
          compact ? "h-2 w-2" : "h-1.5 w-1.5",
          workflowStatus === "pending" && "bg-status-booked",
          workflowStatus === "cutting" && "bg-status-cutting",
          workflowStatus === "stitching" && "bg-status-stitching",
          workflowStatus === "ready" && "bg-status-ready",
          workflowStatus === "delivered" && "bg-status-ready",
          workflowStatus === "cancelled" && "bg-muted-slate",
        )}
        aria-hidden
      />
      {statusLabel(workflowStatus, t)}
    </span>
  );
}
