import type {
  AssignmentsOverview,
  DashboardData,
  MarkReadyResult,
  Order,
  OrderFullDetail,
  PaginatedList,
  ReceivablesPageData,
  ReminderResult,
} from "@business-os/tailor";
import { DEFAULT_PAGE_SIZE } from "@business-os/tailor";
import { apiFetch } from "@/core/infrastructure/api/api-client";
import type { NewOrderDraft } from "@/tailor/infrastructure/data/new-order.mock";
import type { OrderListFilter } from "@/tailor/infrastructure/data/order-filters";
import type { OrderListSort } from "@/tailor/infrastructure/data/order-list-params";

export interface MarkOrderReadyPayload {
  sendWhatsApp?: boolean;
  sendEmail?: boolean;
  emailNotes?: string;
}

export interface OrdersQueryParams {
  filter?: OrderListFilter;
  customerId?: string;
  search?: string;
  assignedTo?: string;
  sort?: OrderListSort;
  dueFrom?: string;
  dueTo?: string;
  limit?: number;
  offset?: number;
}

export interface UpdateOrderPayload {
  deliveryDate?: string;
  totalPrice?: string;
  advancePaid?: string;
  dressCode?: string;
  suitCount?: string;
  garmentType?: string;
  fabricSource?: "customer" | "shop";
  fabricNotes?: string;
  styleNotes?: string;
  dressImageUrl?: string;
  dressImagePublicId?: string;
  isRush?: boolean;
  assignedToName?: string;
  measurements?: Record<string, string>;
  style?: Record<string, string>;
}

export interface UpdateOrderStatusPayload {
  status: string;
  paymentCollected?: string;
  paymentNote?: string;
}

function ordersQueryString(params?: OrdersQueryParams) {
  const search = new URLSearchParams();
  if (params?.filter) search.set("filter", params.filter);
  if (params?.customerId) search.set("customerId", params.customerId);
  if (params?.search?.trim()) search.set("search", params.search.trim());
  if (params?.assignedTo?.trim()) {
    search.set("assignedTo", params.assignedTo.trim());
  }
  if (params?.sort && params.sort !== "newest") {
    search.set("sort", params.sort);
  }
  if (params?.dueFrom?.trim()) search.set("dueFrom", params.dueFrom.trim());
  if (params?.dueTo?.trim()) search.set("dueTo", params.dueTo.trim());
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function fetchAssignments() {
  return apiFetch<AssignmentsOverview>("/tailor/orders/assignments");
}

export function fetchDashboard() {
  return apiFetch<DashboardData>("/tailor/orders/dashboard");
}

export function fetchOrdersPage(params?: OrdersQueryParams) {
  return apiFetch<PaginatedList<Order>>(
    `/tailor/orders${ordersQueryString({
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
      ...params,
    })}`,
  );
}

export function fetchOrders(params?: OrdersQueryParams) {
  return fetchOrdersPage(params).then((page) => page.items);
}

export function fetchReceivables() {
  return apiFetch<ReceivablesPageData>("/tailor/orders/receivables");
}

export function markReceivableCustomerPaid(customerId: string) {
  return apiFetch<{ clearedOrders: number }>(
    `/tailor/orders/receivables/customers/${customerId}/mark-paid`,
    { method: "POST" },
  );
}

export function fetchOrderDetail(orderId: string) {
  return apiFetch<OrderFullDetail>(`/tailor/orders/${orderId}`);
}

export function updateOrder(orderId: string, payload: UpdateOrderPayload) {
  return apiFetch<OrderFullDetail>(`/tailor/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function markOrderReady(orderId: string, payload: MarkOrderReadyPayload) {
  return apiFetch<MarkReadyResult>(`/tailor/orders/${orderId}/mark-ready`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateOrderStatus(
  orderId: string,
  payload: UpdateOrderStatusPayload,
) {
  return apiFetch<Order>(`/tailor/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function sendOrderReminder(orderId: string) {
  return apiFetch<ReminderResult>(`/tailor/orders/${orderId}/reminder`, {
    method: "POST",
  });
}

export function createOrder(draft: NewOrderDraft) {
  return apiFetch<Order>("/tailor/orders", {
    method: "POST",
    body: JSON.stringify({
      customerMode: draft.customerMode,
      customerId: draft.customerMode === "existing" ? draft.customerId : undefined,
      customerName: draft.customerName,
      customerPhone: draft.customerPhone,
      customerEmail: draft.customerEmail,
      measurements: draft.measurements,
      style: draft.style,
      garmentType: draft.garmentType,
      dressCode: draft.dressCode,
      suitCount: draft.suitCount,
      dressImageUrl: draft.dressImageUrl || undefined,
      dressImagePublicId: draft.dressImagePublicId || undefined,
      fabricSource: draft.fabricSource,
      fabricNotes: draft.fabricNotes,
      bookingDate: draft.bookingDate,
      deliveryDate: draft.deliveryDate,
      advancePaid: draft.advancePaid,
      totalPrice: draft.totalPrice,
      isRush: draft.isRush,
      assignedToName: draft.assignedToName.trim() || undefined,
    }),
  });
}
