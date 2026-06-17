import type { OrderWorkflowStatus } from "./order";

export interface AssignmentOrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  suitCount: number;
  workflowStatus: OrderWorkflowStatus;
  dueDate: string;
  garmentLabel: string;
  isRush: boolean;
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
  unassignedOrderCount: number;
  unassignedSuitCount: number;
  unassignedOrders: AssignmentOrderItem[];
  assignments: AssignmentSummaryRow[];
}
