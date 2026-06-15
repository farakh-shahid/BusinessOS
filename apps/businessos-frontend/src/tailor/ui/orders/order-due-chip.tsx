"use client";

import type { Order } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { resolveDueUrgency } from "@/tailor/infrastructure/data/order-list-ui";

interface OrderDueChipProps {
  order: Pick<Order, "dueDate" | "workflowStatus"> & {
    status: Order["status"] | string;
  };
  t: Dictionary;
  isRtl?: boolean;
  className?: string;
  size?: "default" | "compact";
}

export function OrderDueChip({
  order,
  t,
  isRtl,
  className,
  size = "default",
}: OrderDueChipProps) {
  if (
    order.workflowStatus === "delivered" ||
    order.workflowStatus === "cancelled"
  ) {
    return null;
  }

  const urgency = resolveDueUrgency(
    order.dueDate,
    order.status as Order["status"],
    false,
  );

  if (!urgency) return null;

  const label =
    urgency.key === "overdue"
      ? t.orderDue.overdueWithDate.replace("{date}", order.dueDate)
      : urgency.key === "due_today"
        ? t.orderDue.due_todayWithDate.replace("{date}", order.dueDate)
        : urgency.key === "due_soon" || urgency.key === "due_later"
          ? t.orderDue[urgency.labelKey].replace("{date}", order.dueDate)
          : t.orderDue[urgency.labelKey];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-bold",
        size === "compact"
          ? "max-w-full shrink-0 gap-0.5 px-1.5 py-0.5 text-[9px] uppercase tracking-wide leading-none"
          : "max-w-full gap-1 px-2.5 py-1 text-[11px] leading-tight",
        urgency.className,
        urgency.key === "overdue" && "shadow-sm",
        isRtl && "flex-row-reverse",
        className,
      )}
    >
      <span
        aria-hidden
        className={size === "compact" ? "text-[8px] leading-none" : undefined}
      >
        {urgency.emoji}
      </span>
      <span className="truncate">{label}</span>
    </span>
  );
}
