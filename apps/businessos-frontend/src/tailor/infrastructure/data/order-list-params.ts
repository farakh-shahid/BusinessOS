import { routes } from "@/core/config/routes";
import {
  parseOrderListFilter,
  type OrderListFilter,
} from "./order-filters";

export type OrderListSort =
  | "newest"
  | "due_asc"
  | "due_desc"
  | "booking_asc"
  | "booking_desc"
  | "priority";

export type OrderListView = "list" | "board" | "table";

const validViews: OrderListView[] = ["list", "board", "table"];

const validSorts: OrderListSort[] = [
  "newest",
  "due_asc",
  "due_desc",
  "booking_asc",
  "booking_desc",
  "priority",
];

const STORAGE_KEY = "businessos.tailor.orderListParams";

export interface OrderListParams {
  filter: OrderListFilter;
  sort: OrderListSort;
  view: OrderListView;
  search: string;
  dueFrom: string;
  dueTo: string;
  assignedTo: string;
}

export const defaultOrderListParams = (): OrderListParams => ({
  filter: "",
  sort: "newest",
  view: "list",
  search: "",
  dueFrom: "",
  dueTo: "",
  assignedTo: "",
});

function parseSort(value: string | null): OrderListSort {
  if (value && validSorts.includes(value as OrderListSort)) {
    return value as OrderListSort;
  }
  return "newest";
}

function parseView(value: string | null): OrderListView {
  if (value && validViews.includes(value as OrderListView)) {
    return value as OrderListView;
  }
  return "list";
}

export function parseOrderListParams(
  searchParams: URLSearchParams,
): OrderListParams {
  return {
    filter: parseOrderListFilter(searchParams.get("filter")),
    sort: parseSort(searchParams.get("sort")),
    view: parseView(searchParams.get("view")),
    search: searchParams.get("search")?.trim() ?? "",
    dueFrom: searchParams.get("dueFrom")?.trim() ?? "",
    dueTo: searchParams.get("dueTo")?.trim() ?? "",
    assignedTo: searchParams.get("assignedTo")?.trim() ?? "",
  };
}

export function hasUrlListParams(searchParams: URLSearchParams): boolean {
  return [
    "filter",
    "sort",
    "view",
    "search",
    "dueFrom",
    "dueTo",
    "assignedTo",
  ].some((key) => Boolean(searchParams.get(key)?.trim()));
}

export function loadPersistedOrderListParams(): OrderListParams | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OrderListParams>;
    return {
      ...defaultOrderListParams(),
      ...parsed,
      filter: parseOrderListFilter(parsed.filter ?? null),
      sort: parseSort(parsed.sort ?? null),
      view: parseView(parsed.view ?? null),
    };
  } catch {
    return null;
  }
}

export function persistOrderListParams(params: OrderListParams): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
    // ignore quota errors
  }
}

export function buildOrdersListUrl(params: OrderListParams): string {
  const sp = new URLSearchParams();
  if (params.filter) sp.set("filter", params.filter);
  if (params.sort && params.sort !== "newest") sp.set("sort", params.sort);
  if (params.view && params.view !== "list") sp.set("view", params.view);
  if (params.search) sp.set("search", params.search);
  if (params.dueFrom) sp.set("dueFrom", params.dueFrom);
  if (params.dueTo) sp.set("dueTo", params.dueTo);
  if (params.assignedTo) sp.set("assignedTo", params.assignedTo);
  const qs = sp.toString();
  return qs ? `${routes.orders}?${qs}` : routes.orders;
}

function startOfWeekIso(date: Date): string {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(date);
  start.setDate(date.getDate() - diff);
  return start.toISOString().slice(0, 10);
}

function endOfWeekIso(date: Date): string {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const end = new Date(date);
  end.setDate(date.getDate() - diff + 6);
  return end.toISOString().slice(0, 10);
}

export function dueThisWeekRange(): { dueFrom: string; dueTo: string } {
  const today = new Date();
  return {
    dueFrom: startOfWeekIso(today),
    dueTo: endOfWeekIso(today),
  };
}
