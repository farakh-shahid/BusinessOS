import type { OrderWorkflowStatus } from "./order";

export interface AssignmentOrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  suitCount: number;
  workflowStatus: OrderWorkflowStatus;
  dueDate: string;
  bookingDate?: string;
  garmentLabel: string;
  isRush: boolean;
  bookedByName?: string;
  cuttingMasterName?: string;
  stitchingMasterName?: string;
}

export interface AssignmentTeamMember {
  workerName: string;
  specialty?: string;
  bookedSuits: number;
  cutSuits: number;
  stitchedSuits: number;
  assignedSuits: number;
  orderCount: number;
  suitCount: number;
  orders: AssignmentOrderItem[];
}

export interface AssignmentSummaryRow {
  assignedToName: string;
  orderCount: number;
  suitCount: number;
  orders: AssignmentOrderItem[];
}

export interface AssignmentsOverview {
  assignees: string[];
  staffSpecialties: Record<string, string>;
  teamMembers: AssignmentTeamMember[];
  unassignedOrderCount: number;
  unassignedSuitCount: number;
  unassignedOrders: AssignmentOrderItem[];
  assignments: AssignmentSummaryRow[];
}

export type ProductionInvolvement = "booked" | "cutting" | "stitching";

export interface ProductionPerformanceRow {
  workerName: string;
  specialty?: string;
  bookedOrders: number;
  bookedSuits: number;
  cutOrders: number;
  cutSuits: number;
  stitchedOrders: number;
  stitchedSuits: number;
  orderCount: number;
  suitCount: number;
}

export interface ProductionPerformanceOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  suitCount: number;
  bookingDate: string;
  workflowStatus: OrderWorkflowStatus;
  garmentLabel: string;
  involvement: ProductionInvolvement[];
}

export interface ProductionPerformanceTotals {
  orderCount: number;
  suitCount: number;
  bookedSuits: number;
  cutSuits: number;
  stitchedSuits: number;
}

export interface ProductionPerformanceData {
  from?: string;
  to?: string;
  workerName?: string;
  totals: ProductionPerformanceTotals;
  staff: ProductionPerformanceRow[];
  orders: ProductionPerformanceOrderRow[];
}
