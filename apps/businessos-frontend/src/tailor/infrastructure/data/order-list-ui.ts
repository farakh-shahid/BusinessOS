import type { OrderStatus } from "@business-os/tailor";
import type { OrderListParams } from "./order-list-params";

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
      className: "border-green-600 bg-green-100 text-green-900",
    };
  }

  if (displayStatus === "overdue") {
    return {
      key: "overdue",
      labelKey: "overdue",
      emoji: "🔴",
      className: "border-red-600 bg-red-100 text-red-900",
    };
  }

  if (displayStatus === "due_today") {
    return {
      key: "due_today",
      labelKey: "due_today",
      emoji: "🔥",
      className: "border-orange-500 bg-orange-100 text-orange-950",
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
      className: "border-red-500 bg-red-50 text-red-900",
    };
  }
  if (diff >= 2 && diff <= 7) {
    return {
      key: "due_soon",
      labelKey: "due_soon",
      emoji: "📅",
      className: "border-amber-500 bg-amber-50 text-amber-900",
    };
  }

  return {
    key: "due_later",
    labelKey: "due_later",
    emoji: "📅",
    className: "border-slate-300 bg-slate-100 text-slate-700",
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
