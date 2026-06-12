"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import {
  fetchSettings,
  updateSettings,
} from "@/tailor/infrastructure/api/settings.api";

export function useSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.settings.tenant,
    queryFn: fetchSettings,
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.tenant });
    },
  });
}
