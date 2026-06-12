"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import {
  createStaff,
  fetchStaff,
  updateStaff,
  type CreateStaffPayload,
  type UpdateStaffPayload,
} from "@/tailor/infrastructure/api/staff.api";

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
    },
  });
}
