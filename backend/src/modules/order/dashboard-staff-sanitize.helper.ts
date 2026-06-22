import type { DashboardData, OrderFullDetail } from "@shared";
import type { UserRole } from "../../generated/prisma/client";
import { shouldHideFinancials } from "../../common/utils/user-role.util";

/** @deprecated Use shouldHideFinancials from user-role.util */
export function isStaffRole(role: UserRole): boolean {
  return shouldHideFinancials(role);
}

export function sanitizeDashboardForStaff(data: DashboardData): DashboardData {
  return {
    ...data,
    stats: {
      ...data.stats,
      paymentDue: 0,
    },
    needsAttention: data.needsAttention.filter(
      (item) => item.kind !== "payment_due",
    ),
    cash: {
      collectedThisMonth: 0,
      deliveredThisMonth: 0,
      changePercent: null,
      outstandingBalance: 0,
      weeklyCollected: data.cash.weeklyCollected.map((bucket) => ({
        ...bucket,
        amount: 0,
      })),
    },
    garmentMix: { totalOrders: 0, items: [] },
    workloadByTailor: [],
  };
}

export function sanitizeOrderFullDetailForStaff(
  order: OrderFullDetail,
): OrderFullDetail {
  return {
    ...order,
    totalPrice: 0,
    advancePaid: 0,
    balanceDue: 0,
    payments: [],
  };
}
