import type {
  AssignmentOrderItem,
  AssignmentTeamMember,
  ProductionInvolvement,
  ProductionPerformanceData,
  ProductionPerformanceOrderRow,
  ProductionPerformanceRow,
} from "@business-os/shared";
import type { OrderStatus } from "../../generated/prisma/client";
import { garmentLabel, orderStatusKey, formatDueDate } from "../common/tailor.mapper";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  isRush: boolean;
  garmentType: Parameters<typeof garmentLabel>[0];
  bookingDate: Date;
  deliveryDate: Date;
  suitCount: number;
  assignedToName?: string | null;
  cuttingMasterName?: string | null;
  stitchingMasterName?: string | null;
  customer: { name: string };
  createdBy?: { name: string } | null;
};

interface WorkerAgg {
  workerName: string;
  bookedOrderIds: Set<string>;
  cutOrderIds: Set<string>;
  stitchedOrderIds: Set<string>;
  assignedOrderIds: Set<string>;
  bookedSuits: number;
  cutSuits: number;
  stitchedSuits: number;
  assignedSuits: number;
  orders: Map<string, AssignmentOrderItem>;
}

function parseBookingDay(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00.000Z`);
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

export function buildBookingDateWhere(
  from?: string,
  to?: string,
): { gte?: Date; lte?: Date } | undefined {
  const start = from ? parseBookingDay(from) : null;
  const end = to ? parseBookingDay(to) : null;
  if (!start && !end) return undefined;

  const range: { gte?: Date; lte?: Date } = {};
  if (start) range.gte = start;
  if (end) {
    const endOfDay = new Date(end);
    endOfDay.setUTCHours(23, 59, 59, 999);
    range.lte = endOfDay;
  }
  return range;
}

function toAssignmentItem(order: OrderRow, suitCount: number): AssignmentOrderItem {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customer.name,
    suitCount,
    workflowStatus: orderStatusKey(
      order.status,
    ) as AssignmentOrderItem["workflowStatus"],
    dueDate: formatDueDate(order.deliveryDate),
    bookingDate: formatDueDate(order.bookingDate),
    garmentLabel: garmentLabel(order.garmentType),
    isRush: order.isRush,
    bookedByName: order.createdBy?.name ?? undefined,
    cuttingMasterName: order.cuttingMasterName ?? undefined,
    stitchingMasterName: order.stitchingMasterName ?? undefined,
  };
}

function ensureWorker(map: Map<string, WorkerAgg>, name: string): WorkerAgg {
  const existing = map.get(name);
  if (existing) return existing;

  const created: WorkerAgg = {
    workerName: name,
    bookedOrderIds: new Set(),
    cutOrderIds: new Set(),
    stitchedOrderIds: new Set(),
    assignedOrderIds: new Set(),
    bookedSuits: 0,
    cutSuits: 0,
    stitchedSuits: 0,
    assignedSuits: 0,
    orders: new Map(),
  };
  map.set(name, created);
  return created;
}

function aggregateOrdersByWorker(orders: OrderRow[]): Map<string, WorkerAgg> {
  const map = new Map<string, WorkerAgg>();

  for (const order of orders) {
    const suits = order.suitCount > 0 ? order.suitCount : 1;
    const item = toAssignmentItem(order, suits);
    const bookedBy = order.createdBy?.name?.trim();
    const cutting = order.cuttingMasterName?.trim();
    const stitching = order.stitchingMasterName?.trim();
    const assigned = order.assignedToName?.trim();

    if (bookedBy) {
      const agg = ensureWorker(map, bookedBy);
      if (!agg.bookedOrderIds.has(order.id)) {
        agg.bookedOrderIds.add(order.id);
        agg.bookedSuits += suits;
      }
      agg.orders.set(order.id, item);
    }

    if (cutting) {
      const agg = ensureWorker(map, cutting);
      if (!agg.cutOrderIds.has(order.id)) {
        agg.cutOrderIds.add(order.id);
        agg.cutSuits += suits;
      }
      agg.orders.set(order.id, item);
    }

    if (stitching) {
      const agg = ensureWorker(map, stitching);
      if (!agg.stitchedOrderIds.has(order.id)) {
        agg.stitchedOrderIds.add(order.id);
        agg.stitchedSuits += suits;
      }
      agg.orders.set(order.id, item);
    }

    if (assigned) {
      const agg = ensureWorker(map, assigned);
      if (!agg.assignedOrderIds.has(order.id)) {
        agg.assignedOrderIds.add(order.id);
        agg.assignedSuits += suits;
      }
      agg.orders.set(order.id, item);
    }
  }

  return map;
}

function workerAggToTeamMember(
  agg: WorkerAgg,
  staffSpecialties: Record<string, string>,
): AssignmentTeamMember {
  const orders = [...agg.orders.values()].sort((a, b) =>
    a.customerName.localeCompare(b.customerName),
  );
  const suitCount = orders.reduce((sum, order) => sum + order.suitCount, 0);

  return {
    workerName: agg.workerName,
    specialty: staffSpecialties[agg.workerName],
    bookedSuits: agg.bookedSuits,
    cutSuits: agg.cutSuits,
    stitchedSuits: agg.stitchedSuits,
    assignedSuits: agg.assignedSuits,
    orderCount: orders.length,
    suitCount,
    orders,
  };
}

export function buildTeamMembers(
  orders: OrderRow[],
  staffNames: string[],
  staffSpecialties: Record<string, string>,
): AssignmentTeamMember[] {
  const map = aggregateOrdersByWorker(orders);

  for (const name of staffNames) {
    ensureWorker(map, name);
  }

  return [...map.values()]
    .map((agg) => workerAggToTeamMember(agg, staffSpecialties))
    .sort((a, b) => a.workerName.localeCompare(b.workerName));
}

function involvementForWorker(
  order: OrderRow,
  workerName: string,
): ProductionInvolvement[] {
  const roles: ProductionInvolvement[] = [];
  const worker = workerName.trim();
  if (!worker) return roles;

  if (order.createdBy?.name?.trim() === worker) roles.push("booked");
  if (order.cuttingMasterName?.trim() === worker) roles.push("cutting");
  if (order.stitchingMasterName?.trim() === worker) roles.push("stitching");
  return roles;
}

export function buildProductionPerformance(
  orders: OrderRow[],
  staffNames: string[],
  staffSpecialties: Record<string, string>,
  from?: string,
  to?: string,
  workerFilter?: string,
): ProductionPerformanceData {
  const map = aggregateOrdersByWorker(orders);

  for (const name of staffNames) {
    ensureWorker(map, name);
  }

  let staff: ProductionPerformanceRow[] = [...map.values()].map((agg) => ({
    workerName: agg.workerName,
    specialty: staffSpecialties[agg.workerName],
    bookedOrders: agg.bookedOrderIds.size,
    bookedSuits: agg.bookedSuits,
    cutOrders: agg.cutOrderIds.size,
    cutSuits: agg.cutSuits,
    stitchedOrders: agg.stitchedOrderIds.size,
    stitchedSuits: agg.stitchedSuits,
    orderCount: agg.orders.size,
    suitCount: [...agg.orders.values()].reduce(
      (sum, order) => sum + order.suitCount,
      0,
    ),
  }));

  const trimmedWorker = workerFilter?.trim();
  if (trimmedWorker) {
    staff = staff.filter((row) => row.workerName === trimmedWorker);
  }

  staff.sort((a, b) => a.workerName.localeCompare(b.workerName));

  const orderRows: ProductionPerformanceOrderRow[] = [];

  for (const order of orders) {
    const suits = order.suitCount > 0 ? order.suitCount : 1;

    if (trimmedWorker) {
      const involvement = involvementForWorker(order, trimmedWorker);
      if (involvement.length === 0) continue;
      orderRows.push({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        suitCount: suits,
        bookingDate: formatDueDate(order.bookingDate),
        workflowStatus: orderStatusKey(
          order.status,
        ) as ProductionPerformanceOrderRow["workflowStatus"],
        garmentLabel: garmentLabel(order.garmentType),
        involvement,
      });
      continue;
    }

    const involvement: ProductionInvolvement[] = [];
    if (order.createdBy?.name?.trim()) involvement.push("booked");
    if (order.cuttingMasterName?.trim()) involvement.push("cutting");
    if (order.stitchingMasterName?.trim()) involvement.push("stitching");
    if (involvement.length === 0) continue;

    orderRows.push({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      suitCount: suits,
      bookingDate: formatDueDate(order.bookingDate),
      workflowStatus: orderStatusKey(
        order.status,
      ) as ProductionPerformanceOrderRow["workflowStatus"],
      garmentLabel: garmentLabel(order.garmentType),
      involvement,
    });
  }

  orderRows.sort((a, b) => b.bookingDate.localeCompare(a.bookingDate));

  const totals = {
    orderCount: orderRows.length,
    suitCount: orderRows.reduce((sum, row) => sum + row.suitCount, 0),
    bookedSuits: staff.reduce((sum, row) => sum + row.bookedSuits, 0),
    cutSuits: staff.reduce((sum, row) => sum + row.cutSuits, 0),
    stitchedSuits: staff.reduce((sum, row) => sum + row.stitchedSuits, 0),
  };

  return {
    from: from?.trim() || undefined,
    to: to?.trim() || undefined,
    workerName: trimmedWorker || undefined,
    totals,
    staff,
    orders: orderRows,
  };
}
