"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import { searchCustomers } from "@/tailor/infrastructure/api/customers.api";

export function useCustomerSearchQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.customers.search(query),
    queryFn: () => searchCustomers(query),
    enabled: enabled && query.trim().length >= 2,
  });
}
