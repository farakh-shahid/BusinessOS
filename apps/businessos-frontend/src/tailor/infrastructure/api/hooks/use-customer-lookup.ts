"use client";

import { useQuery } from "@tanstack/react-query";
import { isValidPakistanPhone } from "@business-os/shared";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import {
  fetchCustomerByPhone,
  lookupCustomers,
} from "@/tailor/infrastructure/api/customers.api";

const LOOKUP_MIN_LENGTH = 2;

export function useCustomerLookupQuery(query: string, enabled: boolean) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: queryKeys.customers.lookup(trimmed),
    queryFn: () => lookupCustomers(trimmed),
    enabled: enabled && trimmed.length >= LOOKUP_MIN_LENGTH,
    staleTime: 30_000,
  });
}

export function useCustomerByPhoneQuery(phone: string, enabled: boolean) {
  const trimmed = phone.trim();
  return useQuery({
    queryKey: queryKeys.customers.byPhone(trimmed),
    queryFn: () => fetchCustomerByPhone(trimmed),
    enabled: enabled && isValidPakistanPhone(trimmed),
    staleTime: 60_000,
  });
}

export { LOOKUP_MIN_LENGTH };
