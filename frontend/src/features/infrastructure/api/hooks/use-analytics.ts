"use client";

import { useQuery } from "@tanstack/react-query";
import { isAdminRole } from "@/core/auth/roles";
import { queryKeys } from "@/core/infrastructure/api/query-keys";
import {
  fetchAnalytics,
  type AnalyticsQueryParams,
} from "@/features/infrastructure/api/analytics.api";
import { useMeQuery } from "./use-auth";

export function useAnalyticsQuery(params: AnalyticsQueryParams) {
  const { data: user } = useMeQuery();
  const isAdmin = isAdminRole(user?.role);
  const view = params.view ?? "week";
  const anchor = params.anchor ?? "";
  const focus = params.focus ?? "";
  const overviewScope = params.overviewScope ?? "";

  return useQuery({
    queryKey: queryKeys.analytics.overview(view, anchor, focus, overviewScope),
    queryFn: () => fetchAnalytics(params),
    enabled: isAdmin,
  });
}
