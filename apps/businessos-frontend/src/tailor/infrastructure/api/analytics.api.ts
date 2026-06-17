import type { TailorAnalytics } from "@business-os/tailor";
import { apiFetch } from "@/core/infrastructure/api/api-client";

export interface AnalyticsQueryParams {
  view?: "week" | "month";
  anchor?: string;
  focus?: string;
  overviewScope?: "year" | "sixMonth" | "month";
}

export function fetchAnalytics(params: AnalyticsQueryParams = {}) {
  const search = new URLSearchParams();
  if (params.view) search.set("view", params.view);
  if (params.anchor) search.set("anchor", params.anchor);
  if (params.focus) search.set("focus", params.focus);
  if (params.overviewScope) search.set("overviewScope", params.overviewScope);
  const qs = search.toString();
  return apiFetch<TailorAnalytics>(
    `/tailor/analytics${qs ? `?${qs}` : ""}`,
  );
}
