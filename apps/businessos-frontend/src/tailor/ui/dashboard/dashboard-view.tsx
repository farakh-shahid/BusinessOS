"use client";

import type { DashboardStats, Order } from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { useDashboardQuery } from "@/tailor/infrastructure/api/hooks/use-orders";
import { formatTodayDate, timeGreeting } from "@/tailor/ui/shared/greeting";
import { ShopHero } from "@/tailor/ui/shared/shop-hero";
import { SectionHeader } from "@/tailor/ui/shared/section-header";
import { CustomerSearchPanel } from "@/tailor/ui/dashboard/customer-search-panel";
import { DashboardDueWeekPanel } from "@/tailor/ui/dashboard/dashboard-due-week-panel";
import { OrderList } from "@/tailor/ui/orders/order-list";
import { DashboardSkeleton } from "@/tailor/ui/skeletons";
import { LayoutDashboard } from "lucide-react";

function bannerStats(orders: Order[], stats: DashboardStats) {
  const active = orders.filter(
    (order) =>
      order.workflowStatus !== "delivered" &&
      order.workflowStatus !== "cancelled",
  );

  return {
    dueToday: stats.dueToday,
    rush: active.filter((order) => order.isRush).length,
    overdue: active.filter((order) => order.status === "overdue").length,
  };
}

export function DashboardView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const { data, isLoading, isError } = useDashboardQuery();

  const shopName = user?.tenantName ?? t.appName;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
        {t.common.error}
      </div>
    );
  }

  const counts = bannerStats(data.orders, data.stats);

  return (
    <>
      <ShopHero
        variant="dashboard"
        eyebrow={`${timeGreeting(t)} 👋`}
        title={shopName}
        dateLabel={formatTodayDate(locale)}
        icon={LayoutDashboard}
        isRtl={isRtl}
        statusItems={[
          { value: counts.dueToday, label: t.dashboard.dueTodayShort },
          { value: counts.rush, label: t.dashboard.rushShort },
          { value: counts.overdue, label: t.dashboard.overdueShort },
        ]}
        newOrderHref={routes.newOrder}
        newOrderLabel={t.nav.newOrder}
      />

      <div className="mt-6 grid gap-x-4 gap-y-3 xl:grid-cols-[minmax(0,1fr)_310px] xl:items-start">
        <SectionHeader
          title={t.dashboard.todayQueue}
          linkHref={routes.orders}
          linkLabel={t.orders.viewAll}
          isRtl={isRtl}
          className="mb-0 xl:col-start-1 xl:row-start-1"
        />

        <h2
          className={cn(
            "hidden font-display text-base font-bold text-foreground xl:col-start-2 xl:row-start-1 xl:block",
            isRtl && "text-right",
          )}
        >
          {t.dashboard.findCustomer}
        </h2>

        <div className="min-w-0 xl:col-start-1 xl:row-start-2">
          <OrderList orders={data.orders} />
        </div>

        <aside className="hidden space-y-4 xl:col-start-2 xl:row-start-2 xl:block">
          <CustomerSearchPanel hideTitle />
          <DashboardDueWeekPanel
            orders={data.orders}
            title={t.dashboard.dueThisWeek}
            isRtl={isRtl}
          />
        </aside>
      </div>

      <div className="mt-4 space-y-4 xl:hidden">
        <CustomerSearchPanel compactTitle={t.dashboard.findCustomer} />
        <DashboardDueWeekPanel
          orders={data.orders}
          title={t.dashboard.dueThisWeek}
          isRtl={isRtl}
        />
      </div>
    </>
  );
}
