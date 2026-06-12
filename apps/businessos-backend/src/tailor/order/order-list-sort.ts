import type { Prisma } from "../../generated/prisma/client";

export function buildOrderListOrderBy(
  sort?: string,
): Prisma.OrderOrderByWithRelationInput[] {
  switch (sort) {
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
    default:
      return [{ createdAt: "desc" }];
  }
}
