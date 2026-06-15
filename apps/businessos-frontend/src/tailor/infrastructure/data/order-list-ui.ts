import type {
  Order,
  OrderListQuickFilterCounts,
  OrderListQuickFilterKey,
  OrderStatus,
  OrderWorkflowStatus,
} from "@business-os/tailor";
import type { OrderListFilter } from "./order-filters";
import type { OrderListParams } from "./order-list-params";
import type { Dictionary } from "@business-os/i18n";

function formatIsoDateShort(iso: string, locale: string): string {
  const parsed = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString(locale === "ur" ? "ur-PK" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatOrderDeliveryDateRange(
  dueFrom: string,
  dueTo: string,
  locale: string,
  t: Dictionary,
): string {
  if (dueFrom && dueTo) {
    if (dueFrom === dueTo) return formatIsoDateShort(dueFrom, locale);
    return `${formatIsoDateShort(dueFrom, locale)} – ${formatIsoDateShort(dueTo, locale)}`;
  }
  if (dueFrom) {
    return `${t.orderList.dueFrom} ${formatIsoDateShort(dueFrom, locale)}`;
  }
  if (dueTo) {
    return `${t.orderList.dueTo} ${formatIsoDateShort(dueTo, locale)}`;
  }
  return "";
}

export function countActiveOrderFilters(params: OrderListParams): number {
  let count = 0;
  if (params.filter) count += 1;
  if (params.sort !== "workflow") count += 1;
  if (params.assignedTo) count += 1;
  return count;
}

export type DueUrgencyKey =
  | "overdue"
  | "due_today"
  | "due_tomorrow"
  | "due_soon"
  | "due_later"
  | "delivered";

export interface DueUrgencyChip {
  key: DueUrgencyKey;
  labelKey: DueUrgencyKey;
  emoji: string;
  className: string;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysBetween(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function resolveDueUrgency(
  dueDateStr: string,
  displayStatus: OrderStatus,
  workflowDelivered: boolean,
): DueUrgencyChip | null {
  if (workflowDelivered || displayStatus === "delivered") {
    return {
      key: "delivered",
      labelKey: "delivered",
      emoji: "✓",
      className:
        "border-status-ready bg-status-ready-bg text-status-ready",
    };
  }

  const parsed = new Date(dueDateStr);
  if (!Number.isNaN(parsed.getTime())) {
    const diff = daysBetween(new Date(), parsed);
    if (diff < 0) {
      return {
        key: "overdue",
        labelKey: "overdue",
        emoji: "🔴",
        className: "border-rose-400 bg-rose-100 text-rose-700",
      };
    }
    if (diff === 0) {
      return {
        key: "due_today",
        labelKey: "due_today",
        emoji: "🔥",
        className: "border-status-urgent bg-status-urgent-bg text-status-urgent",
      };
    }
    if (diff === 1) {
      return {
        key: "due_tomorrow",
        labelKey: "due_tomorrow",
        emoji: "🔴",
        className:
          "border-status-urgent/70 bg-status-urgent-bg text-status-urgent",
      };
    }
    if (diff >= 2 && diff <= 7) {
      return {
        key: "due_soon",
        labelKey: "due_soon",
        emoji: "📅",
        className: "border-status-cutting bg-status-cutting-bg text-[#9A6800]",
      };
    }
  }

  if (displayStatus === "overdue") {
    return {
      key: "overdue",
      labelKey: "overdue",
      emoji: "🔴",
      className: "border-rose-400 bg-rose-100 text-rose-700",
    };
  }

  if (displayStatus === "due_today") {
    return {
      key: "due_today",
      labelKey: "due_today",
      emoji: "🔥",
      className: "border-status-urgent bg-status-urgent-bg text-status-urgent",
    };
  }

  if (Number.isNaN(parsed.getTime())) return null;

  return {
    key: "due_later",
    labelKey: "due_later",
    emoji: "📅",
    className: "border-hairline bg-background text-muted-slate",
  };
}

export function phoneTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length >= 12) {
    return `tel:+${digits}`;
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `tel:+92${digits.slice(1)}`;
  }
  return `tel:${digits || phone}`;
}

const ACTIVE_WORKFLOW: OrderWorkflowStatus[] = [
  "pending",
  "cutting",
  "stitching",
  "ready",
];

export function isActiveWorkflowStatus(status: OrderWorkflowStatus): boolean {
  return ACTIVE_WORKFLOW.includes(status);
}

export function computeOrderListSummary(orders: Order[]) {
  const active = orders.filter((order) =>
    isActiveWorkflowStatus(order.workflowStatus),
  );
  return {
    active: active.length,
    rush: active.filter((order) => order.isRush).length,
    dueToday: active.filter((order) => order.status === "due_today").length,
  };
}

/** Rose highlight for overdue in-progress orders. */
export const OVERDUE_ORDER_SURFACE_CLASS =
  "border-rose-300 bg-rose-50/50 ring-1 ring-rose-200/80";

/** Muted surface for cancelled orders (wins over overdue card styling). */
export const CANCELLED_ORDER_SURFACE_CLASS =
  "border-slate-200 bg-slate-50/90 ring-1 ring-slate-200/70";

export function isOrderOverdue(
  order: Pick<Order, "dueDate" | "workflowStatus"> & {
    status: Order["status"] | string;
  },
): boolean {
  if (
    order.workflowStatus === "cancelled" ||
    order.workflowStatus === "delivered"
  ) {
    return false;
  }
  const urgency = resolveDueUrgency(
    order.dueDate,
    order.status as Order["status"],
    false,
  );
  return urgency?.key === "overdue";
}

/** Card border/background: cancelled → slate, active overdue → rose, else default. */
export function getOrderCardSurfaceClass(
  order: Pick<Order, "dueDate" | "workflowStatus"> & {
    status: Order["status"] | string;
  },
): string {
  if (order.workflowStatus === "cancelled") {
    return CANCELLED_ORDER_SURFACE_CLASS;
  }
  if (isOrderOverdue(order)) {
    return OVERDUE_ORDER_SURFACE_CLASS;
  }
  return "border-hairline";
}

export function quickFilterCount(
  counts: OrderListQuickFilterCounts,
  filter: OrderListFilter,
): number {
  if (filter === "") return counts.all;
  if (filter in counts) {
    return counts[filter as Exclude<OrderListQuickFilterKey, "all">];
  }
  return 0;
}

export function formatOrderDueShort(order: Order, t: Dictionary): string {
  if (order.status === "due_today") return t.orderDue.due_today;
  if (order.status === "overdue") return t.orderDue.overdue;
  return order.dueDate;
}

export const boardColumnOrder: OrderWorkflowStatus[] = [
  "pending",
  "cutting",
  "stitching",
  "ready",
];

export function boardColumnBorderClass(status: OrderWorkflowStatus): string {
  switch (status) {
    case "pending":
      return "border-t-status-booked";
    case "cutting":
      return "border-t-status-cutting";
    case "stitching":
      return "border-t-status-stitching";
    case "ready":
      return "border-t-status-ready";
    default:
      return "border-t-hairline";
  }
}
