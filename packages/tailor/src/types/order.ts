export type OrderStatus =
  | "stitching"
  | "due_today"
  | "overdue"
  | "ready"
  | "cutting"
  | "pending"
  | "delivered"
  | "cancelled";

/** Actual order pipeline status (for dropdown / admin updates) */
export type OrderWorkflowStatus =
  | "pending"
  | "cutting"
  | "stitching"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerInitials: string;
  customerPhone: string;
  /** e.g. "2 x Kurta" */
  items: string;
  suitCount: number;
  garmentLabel: string;
  dressCode?: string;
  bookingDate: string;
  /** Badge display (may show overdue/due_today for in-progress orders) */
  status: OrderStatus;
  /** Pipeline status stored in database */
  workflowStatus: OrderWorkflowStatus;
  dueDate: string;
  isRush?: boolean;
  /** Optional stitcher / tailor assigned to work on this order */
  assignedToName?: string;
  /** Outstanding balance (list + table views) */
  balanceDue?: number;
}

export interface OrderDetail extends Order {
  customerId: string;
  customerPhone: string;
  customerEmail?: string;
  garmentLabel: string;
  garmentType: string;
  balanceDue: number;
  canMarkReady: boolean;
}

export interface MarkReadyNotificationResult {
  attempted: boolean;
  sent: boolean;
  method?: "meta_cloud" | "twilio" | "wa_me_link";
  whatsappUrl?: string;
  reason?: string;
}

export interface MarkReadyResult {
  order: Order;
  notifications: {
    whatsapp: MarkReadyNotificationResult;
    email: MarkReadyNotificationResult;
  };
}

export interface DashboardStats {
  totalOrders: number;
  inProgress: number;
  dueToday: number;
  ready: number;
}

export interface DashboardData {
  stats: DashboardStats;
  orders: Order[];
}
