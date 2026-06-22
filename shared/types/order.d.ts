export type OrderStatus = "stitching" | "due_today" | "overdue" | "ready" | "cutting" | "pending" | "delivered" | "cancelled";
export type OrderWorkflowStatus = "pending" | "cutting" | "stitching" | "ready" | "delivered" | "cancelled";
export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerInitials: string;
    customerPhone: string;
    items: string;
    suitCount: number;
    garmentLabel: string;
    dressCode?: string;
    bookingDate: string;
    status: OrderStatus;
    workflowStatus: OrderWorkflowStatus;
    dueDate: string;
    isRush?: boolean;
    assignedToName?: string;
    balanceDue?: number;
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
    paymentDue: number;
    dueThisWeek: number;
}
export type NeedsAttentionKind = "rush" | "overdue" | "due_today" | "payment_due";
export interface NeedsAttentionItem {
    kind: NeedsAttentionKind;
    count: number;
    detail: string;
}
export interface DashboardReadyPickupItem {
    orderId: string;
    customerName: string;
    customerInitials: string;
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
    needsAttention: NeedsAttentionItem[];
    readyForPickup: DashboardReadyPickupItem[];
    workload: DashboardWorkload;
    cash: DashboardCashSummary;
    dueWeekChart: DashboardDueWeekChart;
    garmentMix: DashboardGarmentMix;
    workloadByTailor: DashboardTailorWorkloadItem[];
    orders: Order[];
    dueSoonOrders: Order[];
}
export type DashboardWorkloadStage = "booked" | "cutting" | "stitching";
export interface DashboardWorkload {
    booked: number;
    bookedToday: number;
    cutting: number;
    stitching: number;
    ready: number;
    bottleneck: DashboardWorkloadStage;
}
export interface DashboardCashWeekBucket {
    week: number;
    amount: number;
    isCurrent: boolean;
}
export interface DashboardCashSummary {
    collectedThisMonth: number;
    deliveredThisMonth: number;
    changePercent: number | null;
    outstandingBalance: number;
    weeklyCollected: DashboardCashWeekBucket[];
}
export type DashboardWeekDayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
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
export type OrderListQuickFilterKey = "all" | "booked_today" | "booked_last_week" | "overdue" | "due_today" | "ready" | "delivered";
export type OrderListQuickFilterCounts = Record<OrderListQuickFilterKey, number>;
