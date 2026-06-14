export type CustomerListSegment =
  | ""
  | "vip"
  | "new"
  | "regular"
  | "has_balance"
  | "has_measurements";

export interface CustomersListParams {
  q?: string;
  segment?: CustomerListSegment;
}

export const CUSTOMER_QUICK_FILTERS: CustomerListSegment[] = [
  "",
  "vip",
  "new",
  "regular",
  "has_balance",
  "has_measurements",
];
