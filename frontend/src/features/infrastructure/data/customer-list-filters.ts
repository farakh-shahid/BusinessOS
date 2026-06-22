export type CustomerListSegment =
  | ""
  | "vip"
  | "new"
  | "regular"
  | "has_balance";

export type CustomerRegisteredPreset =
  | ""
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "custom";

export interface CustomerRegistrationFilter {
  preset: CustomerRegisteredPreset;
  from: string;
  to: string;
}

export interface CustomersListParams {
  q?: string;
  segment?: CustomerListSegment;
  registeredFrom?: string;
  registeredTo?: string;
}

export const CUSTOMER_QUICK_FILTERS: CustomerListSegment[] = [
  "",
  "vip",
  "new",
  "regular",
  "has_balance",
];

export function emptyRegistrationFilter(): CustomerRegistrationFilter {
  return { preset: "", from: "", to: "" };
}

function toDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(date);
  start.setDate(date.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
}

export function resolveRegisteredDateRange(
  filter: CustomerRegistrationFilter,
): { registeredFrom?: string; registeredTo?: string } {
  const now = new Date();

  switch (filter.preset) {
    case "this_week":
      return {
        registeredFrom: toDateInput(startOfWeek(now)),
        registeredTo: toDateInput(now),
      };
    case "last_week": {
      const thisWeekStart = startOfWeek(now);
      const lastWeekEnd = endOfDay(addDays(thisWeekStart, -1));
      const lastWeekStart = startOfWeek(lastWeekEnd);
      return {
        registeredFrom: toDateInput(lastWeekStart),
        registeredTo: toDateInput(lastWeekEnd),
      };
    }
    case "this_month":
      return {
        registeredFrom: toDateInput(startOfMonth(now)),
        registeredTo: toDateInput(now),
      };
    case "last_month": {
      const lastMonth = addMonths(now, -1);
      return {
        registeredFrom: toDateInput(startOfMonth(lastMonth)),
        registeredTo: toDateInput(endOfMonth(lastMonth)),
      };
    }
    case "custom":
      return {
        registeredFrom: filter.from || undefined,
        registeredTo: filter.to || undefined,
      };
    default:
      return {};
  }
}

export function registrationFilterIsActive(
  filter: CustomerRegistrationFilter,
): boolean {
  return filter.preset !== "";
}

export function countActiveCustomerFilters(
  registration: CustomerRegistrationFilter,
): number {
  return registrationFilterIsActive(registration) ? 1 : 0;
}
