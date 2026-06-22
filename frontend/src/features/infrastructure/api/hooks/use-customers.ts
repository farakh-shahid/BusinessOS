"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "@shared";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import {
  fetchCustomerDetail,
  fetchCustomerFilterCounts,
  fetchCustomers,
  fetchCustomersPage,
  updateCustomer,
} from "@/features/infrastructure/api/customers.api";
import type { CustomersListParams } from "@/features/infrastructure/data/customer-list-filters";
import {
  createMeasurement,
  updateMeasurement,
  type MeasurementPayload,
} from "@/features/infrastructure/api/measurements.api";

export function useCustomersQuery() {
  return useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: () => fetchCustomers(),
  });
}

export function useInfiniteCustomersQuery(
  params?: CustomersListParams,
) {
  const listParams = {
    q: params?.q?.trim() || undefined,
    segment: params?.segment || undefined,
    registeredFrom: params?.registeredFrom,
    registeredTo: params?.registeredTo,
  };

  return useInfiniteQuery({
    queryKey: queryKeys.customers.infiniteList(listParams),
    queryFn: ({ pageParam = 0 }) =>
      fetchCustomersPage({
        ...listParams,
        limit: DEFAULT_PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  });
}

export function useCustomerFilterCountsQuery(
  params?: Pick<CustomersListParams, "q" | "registeredFrom" | "registeredTo">,
) {
  return useQuery({
    queryKey: queryKeys.customers.filterCounts(params),
    queryFn: () => fetchCustomerFilterCounts(params),
  });
}

export function useCustomerDetailQuery(customerId: string | null) {
  return useQuery({
    queryKey: queryKeys.customers.detail(customerId ?? ""),
    queryFn: () => fetchCustomerDetail(customerId!),
    enabled: Boolean(customerId),
  });
}

export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      payload,
    }: {
      customerId: string;
      payload: { name?: string; phone?: string; email?: string; isVip?: boolean };
    }) => updateCustomer(customerId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: ["customers", "infinite"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(variables.customerId),
      });
    },
  });
}

export function useSaveCustomerMeasurementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      measurementId,
      payload,
    }: {
      customerId: string;
      measurementId?: string;
      payload: MeasurementPayload;
    }) =>
      measurementId
        ? updateMeasurement(measurementId, payload)
        : createMeasurement(customerId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(variables.customerId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.measurements.byCustomer(variables.customerId),
      });
    },
  });
}
