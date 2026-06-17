"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "@business-os/tailor";
import { isAdminRole } from "@/core/auth/roles";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import {
  createOrder,
  fetchAssignments,
  fetchDashboard,
  fetchNextOrderNumber,
  fetchOrderDetail,
  fetchOrderFilterCounts,
  fetchOrders,
  fetchOrdersPage,
  fetchReceivables,
  markOrderReady,
  markReceivableCustomerPaid,
  sendOrderReminder,
  updateOrder,
  updateOrderStatus,
  type MarkOrderReadyPayload,
  type OrderFilterCountsParams,
  type OrdersQueryParams,
  type UpdateOrderPayload,
  type UpdateOrderStatusPayload,
} from "@/tailor/infrastructure/api/orders.api";
import type { NewOrderDraft } from "@/tailor/infrastructure/data/new-order.mock";

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.orders.dashboard,
    queryFn: fetchDashboard,
  });
}

export function useNextOrderNumberQuery() {
  return useQuery({
    queryKey: queryKeys.orders.nextNumber,
    queryFn: fetchNextOrderNumber,
  });
}

export function useOrdersQuery(params?: OrdersQueryParams) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => fetchOrders(params),
  });
}

export function useInfiniteOrdersQuery(
  params?: Omit<OrdersQueryParams, "limit" | "offset">,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.orders.infiniteList(params),
    queryFn: ({ pageParam = 0 }) =>
      fetchOrdersPage({
        ...params,
        limit: DEFAULT_PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  });
}

export function useOrderFilterCountsQuery(
  params?: OrderFilterCountsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.orders.filterCounts(params),
    queryFn: () => fetchOrderFilterCounts(params),
    enabled,
  });
}

export function useReceivablesQuery() {
  const { data: user } = useMeQuery();
  const isAdmin = isAdminRole(user?.role);

  return useQuery({
    queryKey: queryKeys.orders.receivables,
    queryFn: fetchReceivables,
    enabled: isAdmin,
  });
}

export function useAssignmentsQuery() {
  const { data: user } = useMeQuery();
  const isAdmin = isAdminRole(user?.role);

  return useQuery({
    queryKey: queryKeys.orders.assignments,
    queryFn: fetchAssignments,
    enabled: isAdmin,
  });
}

function invalidateOrderCaches(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.orders.dashboard });
  queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.orders.receivables });
  queryClient.invalidateQueries({ queryKey: queryKeys.orders.assignments });
}

export function useOrderDetailQuery(orderId: string | null) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId ?? ""),
    queryFn: () => fetchOrderDetail(orderId!),
    enabled: Boolean(orderId),
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: NewOrderDraft) => createOrder(draft),
    onSuccess: () => {
      invalidateOrderCaches(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: UpdateOrderPayload;
    }) => updateOrder(orderId, payload),
    onSuccess: (data, variables) => {
      invalidateOrderCaches(queryClient);
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.orderId),
      });
      if (variables.payload.measurements) {
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
        queryClient.invalidateQueries({ queryKey: ["customers", "infinite"] });
        if (data.customerId) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.customers.detail(data.customerId),
          });
        }
      }
    },
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: UpdateOrderStatusPayload;
    }) => updateOrderStatus(orderId, payload),
    onSuccess: (_data, variables) => {
      invalidateOrderCaches(queryClient);
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.orderId),
      });
    },
  });
}

export function useMarkOrderReadyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: MarkOrderReadyPayload;
    }) => markOrderReady(orderId, payload),
    onSuccess: (_data, variables) => {
      invalidateOrderCaches(queryClient);
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.orderId),
      });
    },
  });
}

export function useSendReminderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => sendOrderReminder(orderId),
    onSuccess: (_data, orderId) => {
      invalidateOrderCaches(queryClient);
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      });
    },
  });
}

export function useMarkReceivableCustomerPaidMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => markReceivableCustomerPaid(customerId),
    onSuccess: () => {
      invalidateOrderCaches(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}
