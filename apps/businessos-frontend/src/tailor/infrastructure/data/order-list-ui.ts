import type { Order, OrderStatus, OrderWorkflowStatus } from "@business-os/tailor";
import type { OrderListParams } from "./order-list-params";
import type { Dictionary } from "@business-os/i18n";

export function countActiveOrderFilters(params: OrderListParams): number {
  let count = 0;
  if (params.filter) count += 1;
  if (params.sort !== "newest") count += 1;
  if (params.dueFrom || params.dueTo) count += 1;
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
        "border-status-delivered bg-status-delivered-bg text-status-delivered",
    };
  }

  if (displayStatus === "overdue") {
    return {
      key: "overdue",
      labelKey: "overdue",
      emoji: "🔴",
      className: "border-status-urgent bg-status-urgent-bg text-status-urgent",
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

  const parsed = new Date(dueDateStr);
  if (Number.isNaN(parsed.getTime())) return null;

  const diff = daysBetween(new Date(), parsed);
  if (diff === 1) {
    return {
      key: "due_tomorrow",
      labelKey: "due_tomorrow",
      emoji: "🔴",
      className: "border-status-urgent/70 bg-status-urgent-bg text-status-urgent",
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
