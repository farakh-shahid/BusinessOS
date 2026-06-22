import type { DashboardData, Order } from "@shared";
import { orderAssignedToUser } from "../../common/utils/user-role.util";

function filterOrders(orders: Order[], assigneeName: string): Order[] {
  return orders.filter((order) => orderAssignedToUser(order, assigneeName));
}

function mergeAssigneeQueueOrders(
  inProgress: Order[],
  ready: Order[],
): Order[] {
  const seen = new Set(inProgress.map((order) => order.id));
  const merged = [...inProgress];
  for (const order of ready) {
    if (!seen.has(order.id)) {
      merged.push(order);
      seen.add(order.id);
    }
  }
  return merged;
}

export function filterDashboardForAssignee(
  data: DashboardData,
  assigneeName: string,
  assigneeReadyOrders: Order[] = [],
): DashboardData {
  const inProgress = filterOrders(data.orders, assigneeName);
  const ready = filterOrders(assigneeReadyOrders, assigneeName);
  const orders = mergeAssigneeQueueOrders(inProgress, ready);
  const dueSoonOrders = filterOrders(data.dueSoonOrders, assigneeName);

  const inProgressStatuses = new Set(["pending", "cutting", "stitching"]);

  return {
    ...data,
    orders,
    dueSoonOrders,
    stats: {
      totalOrders: orders.length,
      inProgress: orders.filter((o) => inProgressStatuses.has(o.workflowStatus))
        .length,
      dueToday: orders.filter((o) => o.status === "due_today").length,
      ready: orders.filter((o) => o.workflowStatus === "ready").length,
      rush: orders.filter((o) => o.isRush).length,
      overdue: orders.filter((o) => o.status === "overdue").length,
      paymentDue: 0,
      dueThisWeek: dueSoonOrders.length,
    },
    needsAttention: [],
    readyForPickup: [],
    workload: {
      booked: orders.filter((o) => o.workflowStatus === "pending").length,
      bookedToday: 0,
      cutting: orders.filter((o) => o.workflowStatus === "cutting").length,
      stitching: orders.filter((o) => o.workflowStatus === "stitching").length,
      ready: orders.filter((o) => o.workflowStatus === "ready").length,
      bottleneck: data.workload.bottleneck,
    },
    garmentMix: { totalOrders: 0, items: [] },
    workloadByTailor: [],
  };
}
