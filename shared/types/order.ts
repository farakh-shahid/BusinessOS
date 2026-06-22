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
  /** Staff who booked / created the order */
  bookedByName?: string;
  cuttingMasterName?: string;
  stitchingMasterName?: string;
  /** Outstanding balance (list + table views) */
  balanceDue?: number;
  /** Whether the customer is marked VIP */
  customerIsVip?: boolean;
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
  method?: "baileys" | "meta_cloud" | "twilio" | "wa_me_link";
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
  rush: number;
  overdue: number;
  /** Delivered orders with outstanding balance. */
  paymentDue: number;
  /** Active orders due within the current calendar week. */
  dueThisWeek: number;
}

export type NeedsAttentionKind = "rush" | "overdue" | "due_today" | "payment_due";

export interface NeedsAttentionItem {
  kind: NeedsAttentionKind;
  count: number;
  /** Short preview — customer names or garment counts. */
  detail: string;
}

export interface DashboardReadyPickupItem {
  orderId: string;
  customerName: string;
  customerInitials: string;
  /** e.g. "Shalwar Qameez · 2 days" */
  subtitle: string;
}

export interface DashboardGarmentMixItem {
  garmentType: string;
  garmentLabel: string;
  count: number;
  percent: number;
}

export interface DashboardGarmentMix {
  totalOrders: number;
  items: DashboardGarmentMixItem[];
}

export interface DashboardTailorWorkloadItem {
  name: string;
  count: number;
  isUnassigned?: boolean;
}

export interface DashboardData {
  stats: DashboardStats;
  /** Rush, overdue, due today, and delivered-unpaid highlights. */
  needsAttention: NeedsAttentionItem[];
  /** Ready orders waiting for customer pickup (preview list). */
  readyForPickup: DashboardReadyPickupItem[];
  workload: DashboardWorkload;
  cash: DashboardCashSummary;
  dueWeekChart: DashboardDueWeekChart;
  garmentMix: DashboardGarmentMix;
  workloadByTailor: DashboardTailorWorkloadItem[];
  /** Priority queue preview (rush + nearest due, capped). */
  orders: Order[];
  /** Active orders due within the next 7 days (for sidebar panel). */
  dueSoonOrders: Order[];
}

export type DashboardWorkloadStage = "booked" | "cutting" | "stitching";

export interface DashboardWorkload {
  booked: number;
  /** Orders whose booking date is today (any status). */
  bookedToday: number;
  cutting: number;
  stitching: number;
  ready: number;
  bottleneck: DashboardWorkloadStage;
}

export interface DashboardCashWeekBucket {
  /** Week of month (1–5). */
  week: number;
  amount: number;
  isCurrent: boolean;
}

export interface DashboardCashSummary {
  collectedThisMonth: number;
  deliveredThisMonth: number;
  changePercent: number | null;
  outstandingBalance: number;
  /** Cash collected per week of the current month. */
  weeklyCollected: DashboardCashWeekBucket[];
}

export type DashboardWeekDayKey =
  | "sun"
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat";

export interface DashboardDueWeekDay {
  key: DashboardWeekDayKey;
  count: number;
  isToday: boolean;
}

export interface DashboardDueWeekChart {
  days: DashboardDueWeekDay[];
  heaviestDay: DashboardWeekDayKey;
  heaviestCount: number;
  overdueCount: number;
}

/** Quick-filter keys on the orders list toolbar (matches UI chips). */
export type OrderListQuickFilterKey =
  | "all"
  | "booked_today"
  | "booked_last_week"
  | "overdue"
  | "due_today"
  | "ready"
  | "delivered";

export type OrderListQuickFilterCounts = Record<OrderListQuickFilterKey, number>;
