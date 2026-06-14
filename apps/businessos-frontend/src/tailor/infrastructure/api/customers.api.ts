import type {
  CustomerDetail,
  CustomerListEntry,
  CustomerSearchResult,
  PaginatedList,
  TailorCustomer,
} from "@business-os/tailor";
import { DEFAULT_PAGE_SIZE } from "@business-os/tailor";
import { apiFetch } from "@/core/infrastructure/api/api-client";
import type { CustomersListParams } from "@/tailor/infrastructure/data/customer-list-filters";

export function fetchCustomersPage(
  params?: CustomersListParams & { limit?: number; offset?: number },
) {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? DEFAULT_PAGE_SIZE));
  if (params?.offset) search.set("offset", String(params.offset));
  if (params?.q?.trim()) search.set("q", params.q.trim());
  if (params?.segment) search.set("segment", params.segment);
  return apiFetch<PaginatedList<CustomerListEntry>>(
    `/tailor/customers?${search.toString()}`,
  );
}

export function fetchCustomers(params?: { limit?: number; offset?: number }) {
  return fetchCustomersPage(params).then((page) => page.items);
}

export function fetchCustomerDetail(customerId: string) {
  return apiFetch<CustomerDetail>(`/tailor/customers/${customerId}`);
}

export function searchCustomers(query: string) {
  const params = new URLSearchParams({ q: query });
  return apiFetch<CustomerSearchResult[]>(
    `/tailor/customers/search?${params.toString()}`,
  );
}

export function lookupCustomers(query: string) {
  const params = new URLSearchParams({ q: query });
  return apiFetch<TailorCustomer[]>(
    `/tailor/customers/lookup?${params.toString()}`,
  );
}

export function fetchCustomerByPhone(phone: string) {
  const params = new URLSearchParams({ phone });
  return apiFetch<TailorCustomer | null>(
    `/tailor/customers/by-phone?${params.toString()}`,
  );
}

export function createCustomer(payload: {
  name: string;
  phone: string;
  email?: string;
  preferredLocale?: "en" | "ur";
}) {
  return apiFetch<TailorCustomer>("/tailor/customers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCustomer(
  customerId: string,
  payload: { name?: string; phone?: string; email?: string; isVip?: boolean },
) {
  return apiFetch<TailorCustomer>(`/tailor/customers/${customerId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
