"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import { clearAccessToken, setAccessToken } from "@/core/auth/auth-storage";
import { loginRequest, meRequest, signupRequest, updateProfileRequest } from "@/features/infrastructure/api/auth.api";

export function useMeQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: meRequest,
    enabled: enabled && !!getTokenSafe(),
    retry: false,
  });
}

function getTokenSafe() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("businessos-access-token");
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ login, password }: { login: string; password: string }) =>
      loginRequest(login, password),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      shopName: string;
      name: string;
      phone: string;
      password: string;
    }) => signupRequest(payload),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearAccessToken();
    queryClient.clear();
  };
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me, data);
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.assignments });
    },
  });
}
