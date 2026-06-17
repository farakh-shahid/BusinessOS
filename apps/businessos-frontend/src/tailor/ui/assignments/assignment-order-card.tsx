"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import type { AssignmentOrderItem } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { boardColumnBorderClass } from "@/tailor/infrastructure/data/order-list-ui";
import { OrderWorkflowStatusBadge } from "@/tailor/ui/orders/order-workflow-status-badge";

const assignmentStatusChipClass =
  "px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide";

interface AssignmentOrderCardProps {
  order: AssignmentOrderItem;
  t: Dictionary;
  isRtl: boolean;
  draggable?: boolean;
  showStatus?: boolean;
  onDragStart?: () => void;
}

export function AssignmentOrderCard({
  order,
  t,
  isRtl,
  draggable = false,
  showStatus = true,
  onDragStart,
}: AssignmentOrderCardProps) {
  return (
    <Link
      href={routes.orderDetail(order.id)}
      draggable={draggable}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/order-id", order.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      className={cn(
        "block rounded-[10px] border border-hairline border-t-[3px] bg-background p-2.5 transition-shadow hover:shadow-sm",
        boardColumnBorderClass(order.workflowStatus),
        draggable && "cursor-grab active:cursor-grabbing",
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-xs font-semibold text-foreground",
          isRtl && "flex-row-reverse justify-end",
        )}
      >
        <span className="truncate">{order.customerName}</span>
        {order.isRush ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded-full bg-status-urgent-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-status-urgent",
              isRtl && "flex-row-reverse",
            )}
          >
            <Zap className="h-2.5 w-2.5" />
            {t.orderDetail.rush}
          </span>
        ) : null}
      </div>
      <p className="mt-0.5 font-display text-[10px] text-muted-slate">
        #{order.orderNumber}
      </p>
      <div
        className={cn(
          "mt-1.5 flex flex-wrap items-center gap-1.5",
          isRtl && "flex-row-reverse justify-end",
        )}
      >
        <span className="text-[11px] text-muted-slate">
          {order.suitCount}x {order.garmentLabel}
        </span>
        {showStatus ? (
          <OrderWorkflowStatusBadge
            workflowStatus={order.workflowStatus}
            t={t}
            size="compact"
            className={assignmentStatusChipClass}
          />
        ) : null}
      </div>
    </Link>
  );
}
