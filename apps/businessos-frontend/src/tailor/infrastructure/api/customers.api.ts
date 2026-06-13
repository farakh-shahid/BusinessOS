import type {
  CustomerDetail,
  CustomerListEntry,
  CustomerSearchResult,
  TailorCustomer,
} from "@business-os/tailor";
import { apiFetch } from "@/core/infrastructure/api/api-client";

export function fetchCustomers() {
  return apiFetch<CustomerListEntry[]>("/tailor/customers");
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
  payload: { name?: string; phone?: string; email?: string },
) {
  return apiFetch<TailorCustomer>(`/tailor/customers/${customerId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
