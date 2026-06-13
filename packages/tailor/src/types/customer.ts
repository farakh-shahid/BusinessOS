import type { Locale } from "@business-os/shared";
import type { OrderStatus, OrderWorkflowStatus } from "./order";
import type { TailorMeasurement } from "./measurement";

export interface TailorCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredLocale: Locale;
}

/** Customer row in directory list (includes summary stats). */
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

export interface CustomerSearchResult {
  customer: TailorCustomer;
  totalOrders: number;
  garmentCounts: CustomerGarmentCount[];
  orders: CustomerOrderHistoryItem[];
}

export interface CustomerDetail {
  customer: TailorCustomer;
  latestMeasurement: TailorMeasurement | null;
  orders: CustomerOrderHistoryItem[];
  summary: CustomerPaymentSummary;
}
