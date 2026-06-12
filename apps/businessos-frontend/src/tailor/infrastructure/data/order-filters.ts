export type OrderListFilter =
  | ""
  | "pending"
  | "cutting"
  | "stitching"
  | "ready"
  | "ready_not_delivered"
  | "delivered"
  | "overdue"
  | "due_today"
  | "in_progress"
  | "priority"
  | "cancelled"
  | "due_this_week";

const validFilters: OrderListFilter[] = [
  "",
  "pending",
  "cutting",
  "stitching",
  "ready",
  "ready_not_delivered",
  "delivered",
  "overdue",
  "due_today",
  "due_this_week",
  "priority",
  "cancelled",
  "in_progress",
];

export function parseOrderListFilter(value: string | null): OrderListFilter {
  if (value && validFilters.includes(value as OrderListFilter)) {
    return value as OrderListFilter;
  }
  return "";
}

export const orderFilterOptions: OrderListFilter[] = [
  "",
  "ready_not_delivered",
  "overdue",
  "due_today",
  "due_this_week",
  "priority",
  "pending",
  "cutting",
  "stitching",
  "delivered",
  "cancelled",
];
