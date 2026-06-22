"use client";

import { getDictionary } from "@/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { isAdminRole, canCreateOrders } from "@/core/auth/roles";
import { useMeQuery } from "@/features/infrastructure/api/hooks/use-auth";
import { useDashboardQuery } from "@/features/infrastructure/api/hooks/use-orders";
import { formatTodayDate, timeGreeting } from "@/features/ui/shared/greeting";
import { ShopHero } from "@/features/ui/shared/shop-hero";
import {
  CustomerSearchPanel,
  CustomerSearchMobileHeader,
  CustomerSearchMobileResults,
  CustomerSearchMobileShell,
} from "@/features/ui/dashboard/customer-search-panel";
import { DashboardDueWeekChartPanel } from "@/features/ui/dashboard/dashboard-due-week-chart";
import { DashboardDueWeekPanel } from "@/features/ui/dashboard/dashboard-due-week-panel";
import { DashboardCashPanel } from "@/features/ui/dashboard/dashboard-cash-panel";
import { DashboardGarmentMixPanel } from "@/features/ui/dashboard/dashboard-garment-mix-panel";
import { DashboardSectionLabel } from "@/features/ui/dashboard/dashboard-section-label";
import { DashboardTailorWorkloadPanel } from "@/features/ui/dashboard/dashboard-tailor-workload-panel";
import { DashboardWorkloadPanel } from "@/features/ui/dashboard/dashboard-workload-panel";
import { NeedsAttentionPanel } from "@/features/ui/dashboard/needs-attention-panel";
import { DashboardQueueList } from "@/features/ui/dashboard/dashboard-queue-list";
import { DashboardSkeleton } from "@/features/ui/skeletons";

export function DashboardView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const isAdmin = isAdminRole(user?.role);
  const showNewOrder = canCreateOrders(user?.role);
  const { data, isLoading, isError } = useDashboardQuery();

  const shopName = user?.tenantName ?? t.appName;
  const firstName = user?.name?.split(" ")[0] ?? "";

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

  const { stats, orders: queueOrders } = data;

  return (
    <>
      <CustomerSearchMobileShell compactTitle={t.dashboard.findCustomer}>
        <div
          className={cn(
            "mobile-sticky-toolbar space-y-4",
          )}
        >
          <ShopHero
            badge={t.nav.dashboard}
            eyebrow={
              firstName
                ? `${timeGreeting(t)}, ${firstName}`
                : timeGreeting(t)
            }
            title={shopName}
            dateLabel={formatTodayDate(locale)}
            isRtl={isRtl}
            newOrderHref={showNewOrder ? routes.newOrder : undefined}
            newOrderLabel={showNewOrder ? t.nav.newOrder : undefined}
          />

          {isAdmin ? (
            <CustomerSearchMobileHeader className="xl:hidden" />
          ) : null}
        </div>

        {isAdmin ? (
          <CustomerSearchMobileResults className="mt-4 xl:hidden" />
        ) : null}
      </CustomerSearchMobileShell>

      {isAdmin ? (
      <>
      <div className="hidden md:block">
        <DashboardSectionLabel isRtl={isRtl}>
          {t.dashboard.prioritiesSection}
        </DashboardSectionLabel>

        <div className="grid min-w-0 gap-3.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-stretch">
          <NeedsAttentionPanel
            items={data.needsAttention}
            readyForPickup={data.readyForPickup}
            readyCount={stats.ready}
            t={t}
            isRtl={isRtl}
          />

          <div className="flex min-w-0 flex-col gap-4 lg:h-full">
            <DashboardWorkloadPanel
              workload={data.workload}
              t={t}
              isRtl={isRtl}
            />
            <DashboardCashPanel
              cash={data.cash}
              t={t}
              isRtl={isRtl}
              className="min-h-0 flex-1"
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <DashboardSectionLabel isRtl={isRtl}>
          {t.dashboard.insightsSection}
        </DashboardSectionLabel>

        <div className="grid gap-3.5 lg:grid-cols-3">
          <DashboardDueWeekChartPanel
            chart={data.dueWeekChart}
            title={t.dashboard.dueThisWeek}
            t={t}
            isRtl={isRtl}
          />
          <DashboardGarmentMixPanel mix={data.garmentMix} t={t} isRtl={isRtl} />
          <DashboardTailorWorkloadPanel
            items={data.workloadByTailor}
            t={t}
            isRtl={isRtl}
          />
        </div>
      </div>
      </>
      ) : null}

      <DashboardSectionLabel isRtl={isRtl}>
        {t.dashboard.todayQueue}
      </DashboardSectionLabel>

      <div className="grid gap-3.5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
        <div className="min-w-0">
          {queueOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              {t.dashboard.queueEmpty}
            </div>
          ) : (
            <DashboardQueueList
              orders={queueOrders}
              showViewAll={
                stats.inProgress + stats.ready > queueOrders.length
              }
            />
          )}
        </div>

        {isAdmin ? (
          <aside className="hidden space-y-3.5 xl:block">
            <CustomerSearchPanel compactTitle={t.dashboard.findCustomer} />
            <DashboardDueWeekPanel
              orders={data.dueSoonOrders}
              title={t.dashboard.dueThisWeek}
              isRtl={isRtl}
            />
          </aside>
        ) : null}
      </div>
    </>
  );
}
