"use client";

import type { Order } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { resolveDueUrgency } from "@/tailor/infrastructure/data/order-list-ui";

interface OrderDueChipProps {
  order: Order;
  t: Dictionary;
  isRtl?: boolean;
  className?: string;
}

export function OrderDueChip({ order, t, isRtl, className }: OrderDueChipProps) {
  const urgency = resolveDueUrgency(
    order.dueDate,
    order.status,
    order.workflowStatus === "delivered",
  );

  if (!urgency) return null;

  const label =
    urgency.key === "due_soon" || urgency.key === "due_later"
      ? t.orderDue[urgency.labelKey].replace("{date}", order.dueDate)
      : t.orderDue[urgency.labelKey];

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold leading-tight",
        urgency.className,
        isRtl && "flex-row-reverse",
        className,
      )}
    >
      <span aria-hidden>{urgency.emoji}</span>
      <span className="truncate">{label}</span>
    </span>
  );
}
