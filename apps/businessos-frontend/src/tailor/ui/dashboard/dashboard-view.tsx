"use client";

import { LayoutDashboard } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { useDashboardQuery } from "@/tailor/infrastructure/api/hooks/use-orders";
import { formatTodayDate, timeGreeting } from "@/tailor/ui/shared/greeting";
import { ShopHero } from "@/tailor/ui/shared/shop-hero";
import { StatsRow } from "@/tailor/ui/dashboard/stats-row";
import { CustomerSearchPanel } from "@/tailor/ui/dashboard/customer-search-panel";
import { OrderList } from "@/tailor/ui/orders/order-list";

export function DashboardView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const { data, isLoading, isError } = useDashboardQuery();

  const firstName = user?.name?.split(" ")[0] ?? "";
  const shopName = user?.tenantName ?? t.appName;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
        {t.common.loading}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
        {t.common.error}
      </div>
    );
  }

  const eyebrow = firstName
    ? `${timeGreeting(t)}, ${firstName}`
    : timeGreeting(t);

  return (
    <>
      <ShopHero
        eyebrow={eyebrow}
        title={shopName}
        dateLabel={formatTodayDate(locale)}
        icon={LayoutDashboard}
        isRtl={isRtl}
      />

      <StatsRow stats={data.stats} />
      <CustomerSearchPanel />
      <OrderList orders={data.orders} />
    </>
  );
}
