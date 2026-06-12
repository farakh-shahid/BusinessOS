import type { OrderWorkflowStatus } from "./order";

export interface AssignmentOrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  suitCount: number;
  workflowStatus: OrderWorkflowStatus;
  dueDate: string;
  garmentLabel: string;
}

export interface AssignmentSummaryRow {
  assignedToName: string;
  orderCount: number;
  suitCount: number;
  orders: AssignmentOrderItem[];
}

export interface AssignmentsOverview {
  assignees: string[];
  unassignedOrderCount: number;
  unassignedSuitCount: number;
  assignments: AssignmentSummaryRow[];
}
