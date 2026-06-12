"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import {
  fetchCustomerDetail,
  fetchCustomers,
  updateCustomer,
} from "@/tailor/infrastructure/api/customers.api";
import {
  createMeasurement,
  updateMeasurement,
  type MeasurementPayload,
} from "@/tailor/infrastructure/api/measurements.api";

export function useCustomersQuery() {
  return useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: fetchCustomers,
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
      payload: { name?: string; phone?: string; email?: string };
    }) => updateCustomer(customerId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
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
