import type { Locale } from "@business-os/shared";
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

/** Style choices from the customer's most recent order for a garment type. */
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

export type CustomerListQuickFilterKey =
  | "all"
  | "vip"
  | "new"
  | "regular"
  | "has_balance"
  | "has_measurements";

export type CustomerListQuickFilterCounts = Record<
  CustomerListQuickFilterKey,
  number
>;

export interface CustomerDetail {
  customer: TailorCustomer;
  latestMeasurement: TailorMeasurement | null;
  /** Latest saved profile per garment type (for new-order prefill). */
  savedMeasurements: TailorMeasurement[];
  /** Style specs from the latest order per garment type. */
  lastOrderStyles: CustomerGarmentStyleProfile[];
  orders: CustomerOrderHistoryItem[];
  summary: CustomerPaymentSummary;
}
