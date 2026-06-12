import type { Locale } from "@business-os/shared";
import type { OrderStatus } from "./order";
import type { TailorMeasurement } from "./measurement";

export interface TailorCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredLocale: Locale;
}

export interface CustomerOrderHistoryItem {
  id: string;
  orderNumber: string;
  garmentType: string;
  garmentLabel: string;
  status: OrderStatus;
  deliveryDate: string;
  totalPrice: number;
}

export interface CustomerGarmentCount {
  garmentType: string;
  garmentLabel: string;
  count: number;
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
}
