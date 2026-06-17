import type {
  AssignmentOrderItem,
  AssignmentsOverview,
  OrderWorkflowStatus,
} from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";

export type AssignmentView = "grid" | "board" | "table";

export const ASSIGNMENTS_VIEW_STORAGE_KEY = "businessos-assignments-view";

export type PersonBoardWorkerKey = string | "__unassigned__";

export const PERSON_WORKFLOW_COLUMNS = [
  "pending",
  "cutting",
  "stitching",
  "ready",
] as const satisfies readonly OrderWorkflowStatus[];

export type PersonWorkflowColumnStatus = (typeof PERSON_WORKFLOW_COLUMNS)[number];

export function loadAssignmentView(): AssignmentView {
  if (typeof window === "undefined") return "grid";
  const stored = localStorage.getItem(ASSIGNMENTS_VIEW_STORAGE_KEY);
  if (stored === "table") return "table";
  if (stored === "board") return "board";
  return "grid";
}

export function persistAssignmentView(view: AssignmentView) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ASSIGNMENTS_VIEW_STORAGE_KEY, view);
}

export interface AssignmentKanbanColumn {
  key: string;
  workerName: string | null;
  displayName: string;
  roleLabel?: string;
  orderCount: number;
  orders: AssignmentOrderItem[];
}

export interface AssignmentTableRow extends AssignmentOrderItem {
  assignedToName: string | null;
  assignedLabel: string;
}

export function buildAssignmentColumns(
  data: AssignmentsOverview,
  t: Dictionary,
): AssignmentKanbanColumn[] {
  return [
    ...data.assignments.map((row) => ({
      key: row.assignedToName,
      workerName: row.assignedToName,
      displayName: row.assignedToName,
      roleLabel:
        data.staffSpecialties[row.assignedToName] ??
        inferWorkerRoleLabel(row.orders, t),
      orderCount: row.orderCount,
      orders: row.orders,
    })),
    {
      key: "__unassigned__",
      workerName: null,
      displayName: t.assignments.unassigned,
      orderCount: data.unassignedOrderCount,
      orders: data.unassignedOrders,
    },
  ];
}

export interface AssignmentBoardRows {
  workerColumns: AssignmentKanbanColumn[];
  unassignedColumn: AssignmentKanbanColumn | null;
}

/** Workers on row 1; unassigned on row 2. */
export function splitAssignmentBoardRows(
  columns: AssignmentKanbanColumn[],
): AssignmentBoardRows {
  const workerColumns = columns.filter((column) => column.workerName !== null);
  const unassignedColumn =
    columns.find((column) => column.workerName === null) ?? null;

  return { workerColumns, unassignedColumn };
}

export function assignmentBoardColumnWidthClass(
  visibleCount: 3 | 4,
): string {
  if (visibleCount === 3) {
    return "w-[max(220px,calc((100%-1.5rem)/3))]";
  }
  return "w-[max(220px,calc((100%-2.25rem)/4))]";
}

export function flattenAssignmentOrders(
  data: AssignmentsOverview,
  t: Dictionary,
): AssignmentTableRow[] {
  const rows: AssignmentTableRow[] = [];

  for (const row of data.assignments) {
    for (const order of row.orders) {
      rows.push({
        ...order,
        assignedToName: row.assignedToName,
        assignedLabel: row.assignedToName,
      });
    }
  }

  for (const order of data.unassignedOrders) {
    rows.push({
      ...order,
      assignedToName: null,
      assignedLabel: t.assignments.unassigned,
    });
  }

  return rows.sort((a, b) => {
    const byAssignee = a.assignedLabel.localeCompare(b.assignedLabel);
    if (byAssignee !== 0) return byAssignee;
    return a.customerName.localeCompare(b.customerName);
  });
}

export function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
}

export function inferWorkerRoleLabel(
  orders: AssignmentOrderItem[],
  t: Dictionary,
): string {
  if (orders.length === 0) return t.assignments.teamMember;

  const counts: Record<OrderWorkflowStatus, number> = {
    pending: 0,
    cutting: 0,
    stitching: 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
  };

  for (const order of orders) {
    if (order.workflowStatus in counts) {
      counts[order.workflowStatus] += 1;
    }
  }

  const dominant = (
    Object.entries(counts) as [OrderWorkflowStatus, number][]
  ).sort((a, b) => b[1] - a[1])[0]?.[0];

  switch (dominant) {
    case "cutting":
      return t.assignments.roleMasterCutter;
    case "stitching":
      return t.assignments.roleStitcher;
    case "ready":
      return t.assignments.roleFinisher;
    case "pending":
      return t.assignments.roleBooked;
    default:
      return t.assignments.teamMember;
  }
}

export function workflowStatusLabel(
  status: OrderWorkflowStatus,
  t: Dictionary,
): string {
  if (status === "pending") return t.orderList.boardBooked;
  if (status === "delivered") return t.orderStatus.delivered;
  if (status === "cancelled") return t.orderStatus.cancelled;
  return t.orderStatus[status];
}

export interface AssignmentPersonGridItem {
  key: PersonBoardWorkerKey;
  workerName: string | null;
  displayName: string;
  roleLabel: string;
  orderCount: number;
  suitCount: number;
  statusCounts: Record<PersonWorkflowColumnStatus, number>;
  orders: AssignmentOrderItem[];
}

export interface PersonStatusColumn {
  status: PersonWorkflowColumnStatus;
  orders: AssignmentOrderItem[];
}

export function countOrdersByWorkflowStatus(
  orders: AssignmentOrderItem[],
): Record<PersonWorkflowColumnStatus, number> {
  const counts: Record<PersonWorkflowColumnStatus, number> = {
    pending: 0,
    cutting: 0,
    stitching: 0,
    ready: 0,
  };

  for (const order of orders) {
    if (order.workflowStatus in counts) {
      counts[order.workflowStatus as PersonWorkflowColumnStatus] += 1;
    }
  }

  return counts;
}

export function buildPersonStatusColumns(
  orders: AssignmentOrderItem[],
): PersonStatusColumn[] {
  return PERSON_WORKFLOW_COLUMNS.map((status) => ({
    status,
    orders: orders.filter((order) => order.workflowStatus === status),
  }));
}

export function buildAssignmentPeopleGrid(
  data: AssignmentsOverview,
  t: Dictionary,
): AssignmentPersonGridItem[] {
  const people: AssignmentPersonGridItem[] = data.assignments.map((row) => ({
    key: row.assignedToName,
    workerName: row.assignedToName,
    displayName: row.assignedToName,
    roleLabel:
      data.staffSpecialties[row.assignedToName] ??
      inferWorkerRoleLabel(row.orders, t),
    orderCount: row.orderCount,
    suitCount: row.suitCount,
    statusCounts: countOrdersByWorkflowStatus(row.orders),
    orders: row.orders,
  }));

  if (data.unassignedOrderCount > 0) {
    people.push({
      key: "__unassigned__",
      workerName: null,
      displayName: t.assignments.unassigned,
      roleLabel: t.assignments.unassignedSubtitle,
      orderCount: data.unassignedOrderCount,
      suitCount: data.unassignedSuitCount,
      statusCounts: countOrdersByWorkflowStatus(data.unassignedOrders),
      orders: data.unassignedOrders,
    });
  }

  return people;
}

export function findAssignmentPerson(
  data: AssignmentsOverview,
  workerKey: PersonBoardWorkerKey,
  t: Dictionary,
): AssignmentPersonGridItem | null {
  return (
    buildAssignmentPeopleGrid(data, t).find((person) => person.key === workerKey) ??
    null
  );
}
