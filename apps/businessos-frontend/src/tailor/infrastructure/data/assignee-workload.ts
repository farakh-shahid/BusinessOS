import type { Dictionary } from "@business-os/i18n";
import type {
  AssignmentOrderItem,
  AssignmentsOverview,
} from "@business-os/tailor";

/** In-progress assignment workload — ready orders are waiting for pickup, not active work. */
export function countActiveAssignedOrders(
  orders: AssignmentOrderItem[],
): number {
  return orders.filter(
    (order) =>
      order.workflowStatus === "pending" ||
      order.workflowStatus === "cutting" ||
      order.workflowStatus === "stitching",
  ).length;
}

export function buildAssigneeWorkloadMap(
  data: AssignmentsOverview | undefined,
): Record<string, number> {
  if (!data) return {};

  const map: Record<string, number> = {};
  for (const name of data.assignees) {
    map[name] = 0;
  }
  for (const row of data.assignments) {
    map[row.assignedToName] = countActiveAssignedOrders(row.orders);
  }
  return map;
}

export function formatAssigneeWorkloadCount(
  count: number,
  t: Dictionary,
): string {
  return t.form.assigneeWorkloadCount.replace("{count}", String(count));
}

export function formatAssigneeOptionLabel(
  name: string,
  workload: Record<string, number> | undefined,
  t: Dictionary,
): string {
  if (!workload || !(name in workload)) return name;
  return `${name} · ${formatAssigneeWorkloadCount(workload[name] ?? 0, t)}`;
}

export function sortAssigneeNamesByWorkload(
  names: string[],
  workload: Record<string, number> | undefined,
): string[] {
  if (!workload) return names;
  return [...names].sort((a, b) => {
    const diff = (workload[a] ?? 0) - (workload[b] ?? 0);
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });
}
