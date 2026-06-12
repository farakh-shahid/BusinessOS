import type { Prisma } from "../../generated/prisma/client";

function parseDay(value: string): Date {
  const parsed = new Date(value);
  parsed.setHours(0, 0, 0, 0);
  return parsed;
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
    case "due_this_week":
      where.deliveryDate = {
        gte: startOfWeek(today),
        lte: endOfWeek(today),
      };
      where.status = { notIn: ["DELIVERED", "CANCELLED"] };
      break;
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
