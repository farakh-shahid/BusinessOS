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

export function usesWorkflowSort(sort?: string): boolean {
  return !sort || sort === "workflow";
}

export function workflowStatusRank(status: OrderStatus): number {
  return WORKFLOW_STATUS_RANK[status] ?? 99;
}

export function compareOrdersForWorkflowSort(
  a: OrderWorkflowSortKey,
  b: OrderWorkflowSortKey,
): number {
  if (a.isRush !== b.isRush) {
    return a.isRush ? -1 : 1;
  }

  const dueDiff = a.deliveryDate.getTime() - b.deliveryDate.getTime();
  if (dueDiff !== 0) return dueDiff;

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
      return [{ deliveryDate: "asc" }, { createdAt: "asc" }];
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
