"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import {
  connectWhatsApp,
  disconnectWhatsApp,
  fetchSettings,
  fetchWhatsAppConnection,
  updateSettings,
} from "@/features/infrastructure/api/settings.api";

export function useSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.settings.tenant,
    queryFn: fetchSettings,
  });
}

export function useWhatsAppConnectionQuery(options?: { poll?: boolean }) {
  return useQuery({
    queryKey: queryKeys.settings.whatsapp,
    queryFn: fetchWhatsAppConnection,
    refetchInterval: (query) => {
      if (!options?.poll) return false;
      const status = query.state.data?.status;
      return status === "connecting" || status === "qr" ? 1500 : false;
    },
  });
}

export function useConnectWhatsAppMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: connectWhatsApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.whatsapp });
    },
  });
}

export function useDisconnectWhatsAppMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectWhatsApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.whatsapp });
    },
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
