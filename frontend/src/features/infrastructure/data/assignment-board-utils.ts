import type {
  AssignmentOrderItem,
  AssignmentsOverview,
  OrderWorkflowStatus,
} from "@shared";
import type { Dictionary } from "@/i18n";

export type AssignmentView = "grid" | "board" | "table";

export type AssignmentPageMode = "workload" | "performance";

export const ASSIGNMENTS_MODE_STORAGE_KEY = "businessos-assignments-mode";

export function loadAssignmentPageMode(): AssignmentPageMode {
  if (typeof window === "undefined") return "workload";
  const stored = localStorage.getItem(ASSIGNMENTS_MODE_STORAGE_KEY);
  return stored === "performance" ? "performance" : "workload";
}

export function persistAssignmentPageMode(mode: AssignmentPageMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ASSIGNMENTS_MODE_STORAGE_KEY, mode);
}

export function formatIsoDateLocal(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function defaultPerformanceDateRange(): { from: string; to: string } {
  return performanceRangeForPreset("this_month");
}

export type PerformanceDatePreset =
  | "this_month"
  | "last_month"
  | "last_week"
  | "last_year"
  | "all_time"
  | "custom";

export const PERFORMANCE_DATE_PRESETS: PerformanceDatePreset[] = [
  "this_month",
  "last_month",
  "last_week",
  "last_year",
  "all_time",
  "custom",
];

export function performanceRangeForPreset(
  preset: Exclude<PerformanceDatePreset, "custom">,
): { from: string; to: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case "this_month": {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        from: formatIsoDateLocal(from),
        to: formatIsoDateLocal(to),
      };
    }
    case "last_month": {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        from: formatIsoDateLocal(from),
        to: formatIsoDateLocal(to),
      };
    }
    case "last_week": {
      const day = today.getDay();
      const diffToMonday = day === 0 ? 6 : day - 1;
      const thisMonday = new Date(today);
      thisMonday.setDate(today.getDate() - diffToMonday);
      const lastSunday = new Date(thisMonday);
      lastSunday.setDate(thisMonday.getDate() - 1);
      const lastMonday = new Date(lastSunday);
      lastMonday.setDate(lastSunday.getDate() - 6);
      return {
        from: formatIsoDateLocal(lastMonday),
        to: formatIsoDateLocal(lastSunday),
      };
    }
    case "last_year": {
      const year = today.getFullYear() - 1;
      return { from: `${year}-01-01`, to: `${year}-12-31` };
    }
    case "all_time":
      return { from: "", to: "" };
    default:
      return { from: "", to: "" };
  }
}

export function inferPerformanceDatePreset(
  from: string,
  to: string,
): PerformanceDatePreset {
  if (!from.trim() && !to.trim()) return "all_time";

  for (const preset of PERFORMANCE_DATE_PRESETS) {
    if (preset === "custom" || preset === "all_time") continue;
    const range = performanceRangeForPreset(preset);
    if (range.from === from.trim() && range.to === to.trim()) return preset;
  }

  return "custom";
}

export function performancePresetLabelKey(
  preset: PerformanceDatePreset,
): keyof Dictionary["assignments"] {
  const map: Record<PerformanceDatePreset, keyof Dictionary["assignments"]> = {
    this_month: "performancePresetThisMonth",
    last_month: "performancePresetLastMonth",
    last_week: "performancePresetLastWeek",
    last_year: "performancePresetLastYear",
    all_time: "performancePresetAllTime",
    custom: "performancePresetCustom",
  };
  return map[preset];
}

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
  bookedSuits: number;
  cutSuits: number;
  stitchedSuits: number;
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
  const source =
    data.teamMembers && data.teamMembers.length > 0
      ? data.teamMembers
      : data.assignments.map((row) => ({
          workerName: row.assignedToName,
          specialty: data.staffSpecialties[row.assignedToName],
          bookedSuits: 0,
          cutSuits: 0,
          stitchedSuits: 0,
          assignedSuits: row.suitCount,
          orderCount: row.orderCount,
          suitCount: row.suitCount,
          orders: row.orders,
        }));

  const people: AssignmentPersonGridItem[] = source.map((member) => ({
    key: member.workerName,
    workerName: member.workerName,
    displayName: member.workerName,
    roleLabel:
      member.specialty ?? inferWorkerRoleLabel(member.orders, t),
    orderCount: member.orderCount,
    suitCount: member.suitCount,
    bookedSuits: member.bookedSuits,
    cutSuits: member.cutSuits,
    stitchedSuits: member.stitchedSuits,
    statusCounts: countOrdersByWorkflowStatus(member.orders),
    orders: member.orders,
  }));

  if (data.unassignedOrderCount > 0) {
    people.push({
      key: "__unassigned__",
      workerName: null,
      displayName: t.assignments.unassigned,
      roleLabel: t.assignments.unassignedSubtitle,
      orderCount: data.unassignedOrderCount,
      suitCount: data.unassignedSuitCount,
      bookedSuits: 0,
      cutSuits: 0,
      stitchedSuits: 0,
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
