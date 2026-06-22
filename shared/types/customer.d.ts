import type { Locale } from "./locale";
import type { OrderStatus, OrderWorkflowStatus } from "./order";
import type { StyleValues, TailorMeasurement } from "./measurement";
export interface TailorCustomer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    preferredLocale: Locale;
    isVip?: boolean;
}
export interface CustomerListEntry extends TailorCustomer {
    totalOrders: number;
    outstandingBalance: number;
    lastOrderDate?: string;
    hasMeasurements: boolean;
}
export interface CustomerOrderHistoryItem {
    id: string;
    orderNumber: string;
    garmentType: string;
    garmentLabel: string;
    status: OrderStatus;
    workflowStatus: OrderWorkflowStatus;
    bookingDate: string;
    deliveryDate: string;
    totalPrice: number;
    advancePaid: number;
    balanceDue: number;
}
export interface CustomerGarmentCount {
    garmentType: string;
    garmentLabel: string;
    count: number;
}
export interface CustomerPaymentSummary {
    totalOrders: number;
    lifetimeValue: number;
    totalPaid: number;
    outstandingBalance: number;
}
export interface CustomerGarmentStyleProfile {
    garmentType: string;
    garmentLabel: string;
    style: StyleValues;
    orderNumber: string;
    orderDate: string;
}
export interface CustomerSearchResult {
    customer: TailorCustomer;
    totalOrders: number;
    garmentCounts: CustomerGarmentCount[];
    orders: CustomerOrderHistoryItem[];
}
export type CustomerListQuickFilterKey = "all" | "vip" | "new" | "regular" | "has_balance" | "has_measurements";
export type CustomerListQuickFilterCounts = Record<CustomerListQuickFilterKey, number>;
export interface CustomerDetail {
    customer: TailorCustomer;
    latestMeasurement: TailorMeasurement | null;
    savedMeasurements: TailorMeasurement[];
    lastOrderStyles: CustomerGarmentStyleProfile[];
    orders: CustomerOrderHistoryItem[];
    summary: CustomerPaymentSummary;
}
