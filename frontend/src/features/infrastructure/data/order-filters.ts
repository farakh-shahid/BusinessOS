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
  | "due_tomorrow"
  | "in_progress"
  | "priority"
  | "payment_due"
  | "cancelled"
  | "due_this_week"
  | "booked_today"
  | "booked_last_week";

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
  "due_tomorrow",
  "due_this_week",
  "booked_today",
  "booked_last_week",
  "priority",
  "payment_due",
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
  "due_tomorrow",
  "due_this_week",
  "priority",
  "payment_due",
  "pending",
  "cutting",
  "stitching",
  "delivered",
  "cancelled",
];

/** Horizontal quick filters on the orders list page toolbar. */
export const orderQuickFilterOptions: OrderListFilter[] = [
  "",
  "booked_today",
  "booked_last_week",
  "overdue",
  "due_today",
  "ready",
  "delivered",
];
