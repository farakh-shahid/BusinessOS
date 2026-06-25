import type { OrderStatus, OrderWorkflowStatus } from "./order";
import type { MeasurementValues, StyleValues } from "./measurement";
export interface OrderPaymentRecord {
    id: string;
    amount: number;
    note?: string;
    recordedByName: string;
    createdAt: string;
}
export interface OrderAuditEntry {
    id: string;
    action: "STATUS_CHANGED" | "ORDER_UPDATED" | "PAYMENT_RECORDED" | "REMINDER_SENT";
    details: Record<string, unknown>;
    userName: string;
    createdAt: string;
}
export interface OrderFullDetail {
    id: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    garmentType: string;
    garmentLabel: string;
    dressCode?: string;
    suitCount: number;
    dressImageUrl?: string;
    dressImagePublicId?: string;
    bookingDate: string;
    deliveryDate: string;
    fabricSource: "customer" | "shop";
    fabricNotes?: string;
    styleNotes?: string;
    measurements: MeasurementValues;
    style: StyleValues;
    advancePaid: number;
    totalPrice: number;
    balanceDue: number;
    isRush: boolean;
    assignedToName?: string;
    workflowStatus: OrderWorkflowStatus;
    status: OrderStatus;
    dueDate: string;
    items: string;
    canMarkReady: boolean;
    readyNotifiedAt?: string;
    payments: OrderPaymentRecord[];
    auditLog: OrderAuditEntry[];
}
export interface ReceivableOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    balanceDue: number;
    workflowStatus: OrderWorkflowStatus;
    dueDate: string;
    garmentLabel: string;
}
export interface ReceivableCustomerRow {
    customerId: string;
    customerName: string;
    customerPhone: string;
    orderCount: number;
    totalBalance: number;
    primaryOrderId: string;
}
export interface ReceivablesSummary {
    totalOutstanding: number;
    customersOwing: number;
    collectedThisMonth: number;
}
export interface ReceivablesData {
    summary: ReceivablesSummary;
    customers: ReceivableCustomerRow[];
}
export interface ReceivedSummary {
    totalReceivedThisMonth: number;
    customersPaid: number;
    ordersPaid: number;
}
export interface ReceivedCustomerRow {
    customerId: string;
    customerName: string;
    customerPhone: string;
    orderCount: number;
    totalReceived: number;
    primaryOrderId: string;
}
export interface ReceivedData {
    summary: ReceivedSummary;
    customers: ReceivedCustomerRow[];
}
export interface ReceivablesPageData {
    receivables: ReceivablesData;
    received: ReceivedData;
}
export interface ReminderResult {
    whatsappUrl?: string;
    sent: boolean;
    reason?: string;
}
