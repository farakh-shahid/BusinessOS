import type { Prisma } from "../../generated/prisma/client";

function parseDay(value: string): Date {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00.000Z`);
  }
  const parsed = new Date(trimmed);
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

/** Calendar day in local TZ, stored the same way as `new Date("YYYY-MM-DD")` (UTC midnight). */
function localTodayUtcMidnight(now = new Date()): Date {
  const iso = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  return new Date(`${iso}T00:00:00.000Z`);
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(date);
  start.setDate(date.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return endOfDay(end);
}

export function buildOrderListWhere(
  tenantId: string,
  filter?: string,
  customerId?: string,
  search?: string,
  assignedTo?: string,
  dueFrom?: string,
  dueTo?: string,
): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = { tenantId };

  if (customerId) {
    where.customerId = customerId;
  }

  if (assignedTo?.trim()) {
    where.assignedToName = assignedTo.trim();
  }

  if (search?.trim()) {
    const q = search.trim();
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { dressCode: { contains: q, mode: "insensitive" } },
      { assignedToName: { contains: q, mode: "insensitive" } },
      { customer: { name: { contains: q, mode: "insensitive" } } },
      { customer: { phone: { contains: q } } },
    ];
  }

  const today = localTodayUtcMidnight();

  switch (filter) {
    case "pending":
      where.status = "PENDING";
      break;
    case "cutting":
      where.status = "CUTTING";
      break;
    case "stitching":
      where.status = "STITCHING";
      break;
    case "ready":
      where.status = "READY";
      break;
    case "ready_not_delivered":
      where.status = "READY";
      break;
    case "delivered":
      where.status = "DELIVERED";
      break;
    case "cancelled":
      where.status = "CANCELLED";
      break;
    case "overdue":
      where.status = { in: ["PENDING", "CUTTING", "STITCHING"] };
      where.deliveryDate = { lt: today };
      break;
    case "due_today":
      where.status = { in: ["PENDING", "CUTTING", "STITCHING", "READY"] };
      where.deliveryDate = today;
      break;
    case "in_progress":
      where.status = { in: ["PENDING", "CUTTING", "STITCHING"] };
      break;
    case "priority":
      where.isRush = true;
      break;
    case "payment_due":
      where.status = "DELIVERED";
      where.balanceDue = { gt: 0 };
      break;
    case "due_this_week": {
      const localNow = new Date();
      where.deliveryDate = {
        gte: startOfWeek(localNow),
        lte: endOfWeek(localNow),
      };
      where.status = { notIn: ["DELIVERED", "CANCELLED"] };
      break;
    }
    case "booked_today":
      where.bookingDate = today;
      break;
    case "booked_last_week": {
      const weekStart = new Date(today);
      weekStart.setUTCDate(weekStart.getUTCDate() - 6);
      where.bookingDate = {
        gte: weekStart,
        lte: endOfDay(today),
      };
      break;
    }
    default:
      break;
  }

  if (dueFrom?.trim() || dueTo?.trim()) {
    const range: Prisma.DateTimeFilter = {
      ...(where.deliveryDate as Prisma.DateTimeFilter | undefined),
    };
    if (dueFrom?.trim()) {
      range.gte = parseDay(dueFrom.trim());
    }
    if (dueTo?.trim()) {
      range.lte = endOfDay(parseDay(dueTo.trim()));
    }
    where.deliveryDate = range;
  }

  return where;
}

/** Quick filters shown on the orders list toolbar — keep in sync with frontend. */
export const ORDER_QUICK_FILTER_KEYS = [
  "",
  "booked_today",
  "booked_last_week",
  "overdue",
  "due_today",
  "ready",
  "delivered",
] as const;
