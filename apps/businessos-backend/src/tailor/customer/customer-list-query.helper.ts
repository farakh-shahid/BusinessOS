import type { Prisma } from "../../generated/prisma/client";

export type CustomerListSegment =
  | "vip"
  | "new"
  | "regular"
  | "has_balance"
  | "has_measurements";

export function buildCustomerListWhere(
  tenantId: string,
  options?: {
    q?: string;
    segment?: CustomerListSegment;
    multiOrderCustomerIds?: string[];
  },
): Prisma.CustomerWhereInput {
  const and: Prisma.CustomerWhereInput[] = [{ tenantId }];

  const q = options?.q?.trim();
  if (q) {
    and.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  switch (options?.segment) {
    case "vip":
      and.push({ isVip: true });
      break;
    case "new":
      and.push({ isVip: false });
      if (options.multiOrderCustomerIds?.length) {
        and.push({ NOT: { id: { in: options.multiOrderCustomerIds } } });
      }
      break;
    case "regular":
      and.push({ isVip: false });
      if (options.multiOrderCustomerIds?.length) {
        and.push({ id: { in: options.multiOrderCustomerIds } });
      } else {
        and.push({ id: { in: [] } });
      }
      break;
    case "has_balance":
      and.push({
        orders: {
          some: {
            balanceDue: { gt: 0 },
            status: { notIn: ["CANCELLED", "DELIVERED"] },
          },
        },
      });
      break;
    case "has_measurements":
      and.push({ measurements: { some: {} } });
      break;
    default:
      break;
  }

  return { AND: and };
}
