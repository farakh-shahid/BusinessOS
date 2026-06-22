"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import {
  createStaff,
  fetchStaff,
  revokeStaffAccess,
  setStaffPassword,
  updateStaff,
  type CreateStaffPayload,
  type UpdateStaffPayload,
} from "@/features/infrastructure/api/staff.api";

export function useStaffQuery() {
  return useQuery({
    queryKey: queryKeys.staff.all,
    queryFn: fetchStaff,
  });
}

export function useCreateStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStaffPayload) => createStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.assignments });
    },
  });
}

export function useUpdateStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      payload,
    }: {
      staffId: string;
      payload: UpdateStaffPayload;
    }) => updateStaff(staffId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.assignments });
    },
  });
}

export function useSetStaffPasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      password,
    }: {
      staffId: string;
      password: string;
    }) => setStaffPassword(staffId, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
    },
  });
}

export function useRevokeStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) => revokeStaffAccess(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.assignments });
    },
  });
}
