"use client";

import type { OrderWorkflowStatus } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { statusBadgeClass } from "@/tailor/infrastructure/data/order-status-colors";

interface OrderWorkflowStatusBadgeProps {
  workflowStatus: OrderWorkflowStatus;
  t: Dictionary;
  className?: string;
}

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
}: OrderWorkflowStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        statusBadgeClass({ workflowStatus }),
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          workflowStatus === "pending" && "bg-status-booked",
          workflowStatus === "cutting" && "bg-status-cutting",
          workflowStatus === "stitching" && "bg-status-stitching",
          workflowStatus === "ready" && "bg-status-ready",
          workflowStatus === "delivered" && "bg-status-delivered",
          workflowStatus === "cancelled" && "bg-status-delivered",
        )}
        aria-hidden
      />
      {statusLabel(workflowStatus, t)}
    </span>
  );
}
