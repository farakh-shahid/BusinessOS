import type { Prisma } from "../../generated/prisma/client";
import type { OrderStatus } from "../../generated/prisma/client";

/** Tailor floor priority when delivery dates tie — active work before booked / done. */
const WORKFLOW_STATUS_RANK: Record<OrderStatus, number> = {
  CUTTING: 0,
  STITCHING: 1,
  PENDING: 2,
  READY: 3,
  DELIVERED: 4,
  CANCELLED: 5,
};

export interface OrderWorkflowSortKey {
  id: string;
  status: OrderStatus;
  deliveryDate: Date;
  isRush: boolean;
  createdAt: Date;
}

/** Calendar day in local TZ, stored as UTC midnight (matches order-list.helpers). */
function localTodayUtcMidnight(now = new Date()): Date {
  const iso = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  return new Date(`${iso}T00:00:00.000Z`);
}

function isClosedStatus(status: OrderStatus): boolean {
  return status === "DELIVERED" || status === "CANCELLED";
}

function isActiveOverdue(order: OrderWorkflowSortKey, today: Date): boolean {
  if (isClosedStatus(order.status)) return false;
  return order.deliveryDate.getTime() < today.getTime();
}

export function usesWorkflowSort(sort?: string): boolean {
  return !sort || sort === "workflow";
}

export function workflowStatusRank(status: OrderStatus): number {
  return WORKFLOW_STATUS_RANK[status] ?? 99;
}

/**
 * Default order list queue: overdue → due soonest → rush tiebreak → floor stage → newest booked.
 * Delivered / cancelled sink to the bottom (newest first).
 */
export function compareOrdersForWorkflowSort(
  a: OrderWorkflowSortKey,
  b: OrderWorkflowSortKey,
): number {
  const today = localTodayUtcMidnight();

  const aClosed = isClosedStatus(a.status);
  const bClosed = isClosedStatus(b.status);
  if (aClosed !== bClosed) {
    return aClosed ? 1 : -1;
  }
  if (aClosed && bClosed) {
    return b.createdAt.getTime() - a.createdAt.getTime();
  }

  const aOverdue = isActiveOverdue(a, today);
  const bOverdue = isActiveOverdue(b, today);
  if (aOverdue !== bOverdue) {
    return aOverdue ? -1 : 1;
  }

  const dueDiff = a.deliveryDate.getTime() - b.deliveryDate.getTime();
  if (dueDiff !== 0) return dueDiff;

  if (a.isRush !== b.isRush) {
    return a.isRush ? -1 : 1;
  }

  const statusDiff =
    workflowStatusRank(a.status) - workflowStatusRank(b.status);
  if (statusDiff !== 0) return statusDiff;

  return b.createdAt.getTime() - a.createdAt.getTime();
}

/** Dashboard queue: nearest delivery first, then rush, then floor stage. */
export function compareOrdersForDashboardQueue(
  a: OrderWorkflowSortKey,
  b: OrderWorkflowSortKey,
): number {
  const dueDiff = a.deliveryDate.getTime() - b.deliveryDate.getTime();
  if (dueDiff !== 0) return dueDiff;

  if (a.isRush !== b.isRush) {
    return a.isRush ? -1 : 1;
  }

  const statusDiff =
    workflowStatusRank(a.status) - workflowStatusRank(b.status);
  if (statusDiff !== 0) return statusDiff;

  return a.createdAt.getTime() - b.createdAt.getTime();
}

export function buildOrderListOrderBy(
  sort?: string,
): Prisma.OrderOrderByWithRelationInput[] {
  switch (sort) {
    case "workflow":
      return [{ deliveryDate: "asc" }, { createdAt: "desc" }];
    case "due_asc":
      return [{ deliveryDate: "asc" }, { createdAt: "desc" }];
    case "due_desc":
      return [{ deliveryDate: "desc" }, { createdAt: "desc" }];
    case "booking_asc":
      return [{ bookingDate: "asc" }, { createdAt: "desc" }];
    case "booking_desc":
      return [{ bookingDate: "desc" }, { createdAt: "desc" }];
    case "priority":
      return [{ isRush: "desc" }, { deliveryDate: "asc" }, { createdAt: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}
