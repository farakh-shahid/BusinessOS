import { garmentLabel } from "../common/tailor.mapper";
import type { NeedsAttentionItem } from "@business-os/tailor";

type OrderPreview = {
  customer: { name: string };
  garmentType: Parameters<typeof garmentLabel>[0];
  suitCount: number;
};

export function buildCustomerNameDetail(
  orders: OrderPreview[],
  maxNames = 2,
): string {
  if (orders.length === 0) return "";
  const unique = [...new Set(orders.map((order) => order.customer.name))];
  const shown = unique.slice(0, maxNames);
  const remaining = unique.length - shown.length;
  const base = shown.join(", ");
  return remaining > 0 ? `${base}, +${remaining} more` : base;
}

export function buildGarmentDetail(orders: OrderPreview[]): string {
  if (orders.length === 0) return "";
  const counts = new Map<string, number>();
  for (const order of orders) {
    const label = garmentLabel(order.garmentType).toLowerCase();
    counts.set(label, (counts.get(label) ?? 0) + (order.suitCount || 1));
  }
  return Array.from(counts.entries())
    .map(([label, count]) => `${count} ${label}${count === 1 ? "" : "s"}`)
    .join(", ");
}

const ATTENTION_ORDER: NeedsAttentionItem["kind"][] = [
  "rush",
  "overdue",
  "due_today",
  "payment_due",
];

export function buildNeedsAttentionList(input: {
  rush: { count: number; preview: OrderPreview[] };
  overdue: { count: number; preview: OrderPreview[] };
  dueToday: { count: number; preview: OrderPreview[] };
  paymentDue: { count: number; preview: OrderPreview[] };
}): NeedsAttentionItem[] {
  const byKind: Record<NeedsAttentionItem["kind"], NeedsAttentionItem> = {
    rush: {
      kind: "rush",
      count: input.rush.count,
      detail: buildGarmentDetail(input.rush.preview),
    },
    overdue: {
      kind: "overdue",
      count: input.overdue.count,
      detail: buildCustomerNameDetail(input.overdue.preview),
    },
    due_today: {
      kind: "due_today",
      count: input.dueToday.count,
      detail: buildGarmentDetail(input.dueToday.preview),
    },
    payment_due: {
      kind: "payment_due",
      count: input.paymentDue.count,
      detail: buildCustomerNameDetail(input.paymentDue.preview),
    },
  };

  return ATTENTION_ORDER.filter((kind) => byKind[kind].count > 0).map(
    (kind) => byKind[kind],
  );
}
