"use client";

import { useEffect, useState } from "react";
import {
  Banknote,
  BarChart3,
  Download,
  FileText,
  Package,
  Shirt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { useAnalyticsQuery } from "@/tailor/infrastructure/api/hooks/use-analytics";
import { AnalyticsCalendarPicker } from "./analytics-calendar-picker";
import {
  clampAnchorToTenant,
  shiftAnchor,
  toDateInputValue,
} from "./analytics-date-utils";
import { formatTodayDate, timeGreeting } from "@/tailor/ui/shared/greeting";
import { ShopHero } from "@/tailor/ui/shared/shop-hero";
import {
  DualStatCompare,
  HorizontalBarChart,
  MonthlyTrendChart,
  PeriodCompareCards,
} from "./analytics-charts";
import {
  buildAnalyticsExportLabels,
  exportAnalyticsCsv,
  exportAnalyticsPdf,
} from "./export-analytics";
import { formatRs, formatTrend } from "./format";
import { AnalyticsSkeleton } from "@/tailor/ui/skeletons";

const metricAccents = [
  { bg: "bg-accent-50", icon: "text-accent-600", ring: "ring-accent-100" },
  { bg: "bg-status-stitching-bg", icon: "text-status-stitching", ring: "ring-status-stitching/20" },
  { bg: "bg-status-booked-bg", icon: "text-status-booked", ring: "ring-status-booked/20" },
  { bg: "bg-status-ready-bg", icon: "text-status-ready", ring: "ring-status-ready/20" },
];

function ReportCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: (typeof metricAccents)[number];
}) {
  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-sm">
      <div
        className={cn(
          "mb-4 flex h-11 w-11 items-center justify-center rounded-xl ring-4",
          accent.bg,
          accent.ring,
        )}
      >
        <Icon className={cn("h-5 w-5", accent.icon)} />
      </div>
      <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

function ProgressRing({ percent, label }: { percent: number; label: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="relative h-24 w-24 shrink-0">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="var(--analytics-chart)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900">
          {percent}%
        </span>
      </div>
      <div>
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-sm text-slate-500">
          {percent}% {label.toLowerCase()}
        </p>
      </div>
    </div>
  );
}

function StatsBarChart({
  points,
  title,
  subtitle,
}: {
  points: { label: string; sub: string; orders: number; revenue: number; disabled?: boolean }[];
  title: string;
  subtitle: string;
}) {
  const active = points.filter((p) => !p.disabled);
  const maxOrders = Math.max(...active.map((p) => p.orders), 1);
  const peakOrders = Math.max(...active.map((p) => p.orders), 0);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-6">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-end justify-between gap-2 sm:gap-3">
        {points.map((point) => {
          const height = point.disabled
            ? 8
            : Math.max((point.orders / maxOrders) * 100, 12);
          const isPeak =
            !point.disabled && point.orders > 0 && point.orders === peakOrders;

          return (
            <div
              key={`${point.label}-${point.sub}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-36 w-full flex-col justify-end">
                <div
                  className={cn(
                    "w-full rounded-t-2xl transition-all",
                    point.disabled && "bg-slate-100",
                    !point.disabled && !isPeak && "bg-accent-100",
                    isPeak && "bg-gradient-to-t from-accent-600 to-accent-400",
                  )}
                  style={{ height: `${height}%` }}
                  title={`${point.orders} orders · ${formatRs(point.revenue)}`}
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase text-slate-400 sm:text-xs">
                  {point.label}
                </p>
                <p className="text-xs font-bold text-slate-700">{point.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AnalyticsView() {
  const { locale } = useLocale();
  const isRtl = locale === "ur";
  const t = getDictionary(locale);
  const { data: user } = useMeQuery();

  const [view, setView] = useState<"week" | "month">("week");
  const [anchor, setAnchor] = useState(() => toDateInputValue(new Date()));
  const [selectedDay, setSelectedDay] = useState(() =>
    toDateInputValue(new Date()),
  );

  const { data, isLoading, isError } = useAnalyticsQuery({
    view,
    anchor,
    focus: selectedDay,
  });

  useEffect(() => {
    if (!data) return;
    const clamped = clampAnchorToTenant(anchor, data.tenantCreatedAt);
    if (clamped !== anchor) setAnchor(clamped);
  }, [data, anchor]);

  useEffect(() => {
    if (!data?.dailyBreakdown.length) return;
    const enabled = data.dailyBreakdown.find((d) => !d.disabled);
    if (enabled && !data.dailyBreakdown.some((d) => d.date === selectedDay && !d.disabled)) {
      setSelectedDay(enabled.date);
    }
  }, [data, selectedDay]);

  function handleJumpToDate(date: string) {
    setAnchor(date);
    setSelectedDay(date);
  }

  const firstName = user?.name?.split(" ")[0] ?? "";

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-16 text-center text-sm text-rose-700">
        {t.common.error}
      </div>
    );
  }

  const statusTotal =
    data.statusBreakdown.pending +
    data.statusBreakdown.inProgress +
    data.statusBreakdown.ready +
    data.statusBreakdown.delivered +
    data.statusBreakdown.cancelled;

  const statusItems = [
    { label: t.analytics.statusPending, value: data.statusBreakdown.pending, color: "bg-status-booked" },
    { label: t.analytics.statusInProgress, value: data.statusBreakdown.inProgress, color: "bg-status-cutting" },
    { label: t.analytics.statusReady, value: data.statusBreakdown.ready, color: "bg-status-ready" },
    { label: t.analytics.statusDelivered, value: data.statusBreakdown.delivered, color: "bg-status-delivered" },
  ];

  const exportLabels = buildAnalyticsExportLabels(t, data.viewMode);
  const analyticsData = data;

  function handlePdfExport() {
    exportAnalyticsPdf(analyticsData, exportLabels);
  }

  const chartPoints = analyticsData.dailyBreakdown.map((d) => ({
    label: d.dayLabel,
    sub: d.dateLabel,
    orders: d.orders,
    revenue: d.revenue,
    disabled: d.disabled,
  }));

  return (
    <div className="-mx-2 space-y-5 sm:-mx-0">
      <ShopHero
        badge={t.hero.analyticsLabel}
        eyebrow={
          firstName
            ? `${timeGreeting(t)}, ${firstName}`
            : timeGreeting(t)
        }
        title={data.shopName}
        dateLabel={formatTodayDate(locale)}
        icon={BarChart3}
        isRtl={isRtl}
      />

      <AnalyticsCalendarPicker
        data={data}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onJumpToDate={handleJumpToDate}
        onPrevious={() => {
          if (!data.canGoPrevious) return;
          setAnchor(shiftAnchor(anchor, view, -1));
        }}
        onNext={() => {
          if (!data.canGoNext) return;
          setAnchor(shiftAnchor(anchor, view, 1));
        }}
        onViewChange={(nextView) => {
          setView(nextView);
          setAnchor(
            clampAnchorToTenant(anchor, data.tenantCreatedAt),
          );
        }}
      />

      <div>
        <div
          className={cn(
            "mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
            isRtl && "sm:flex-row-reverse",
          )}
        >
          <div className={cn(isRtl && "text-right")}>
            <h3 className="text-lg font-bold text-slate-900">
              {t.analytics.periodReports}
            </h3>
            {data.focusLabel ? (
              <p className="mt-1 text-sm font-medium text-analytics-select">
                {t.analytics.reportsFor} {data.focusLabel}
              </p>
            ) : null}
          </div>
          <div
            className={cn(
              "flex flex-wrap gap-2",
              isRtl && "flex-row-reverse",
            )}
          >
            <button
              type="button"
              onClick={() => exportAnalyticsCsv(data, exportLabels)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              {t.analytics.exportCsv}
            </button>
            <button
              type="button"
              onClick={handlePdfExport}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-100"
            >
              <FileText className="h-4 w-4" />
              {t.analytics.exportPdf}
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportCard
            label={t.analytics.revenue}
            value={formatRs(data.selectedPeriod.revenue)}
            icon={Banknote}
            accent={metricAccents[0]}
          />
          <ReportCard
            label={t.analytics.orders}
            value={String(data.selectedPeriod.orders)}
            icon={Package}
            accent={metricAccents[1]}
          />
          <ReportCard
            label={t.analytics.advance}
            value={formatRs(data.selectedPeriod.advanceCollected)}
            icon={Wallet}
            accent={metricAccents[2]}
          />
          <ReportCard
            label={t.analytics.totalCustomers}
            value={String(data.totalCustomers)}
            icon={Users}
            accent={metricAccents[3]}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <StatsBarChart
            points={chartPoints}
            title={t.analytics.orderStatistics}
            subtitle={data.rangeLabel}
          />

          <MonthlyTrendChart
            title={t.analytics.revenueTrend}
            subtitle={t.analytics.lastSixMonths}
            points={data.monthlyTrend.map((m) => ({
              label: m.monthLabel,
              orders: m.orders,
              revenue: m.revenue,
            }))}
          />

          <HorizontalBarChart
            title={t.analytics.revenueByGarment}
            subtitle={data.focusLabel ?? data.rangeLabel}
            items={data.garmentBreakdown.map((g) => ({
              label: g.garmentLabel,
              value: g.revenue,
              subLabel: `${g.count} ${t.analytics.orders.toLowerCase()}`,
            }))}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <DualStatCompare
              title={t.analytics.activeVsDelivered}
              leftLabel={t.analytics.statusInProgress}
              rightLabel={t.analytics.statusDelivered}
              leftValue={data.workflowSnapshot.inProgress}
              rightValue={data.workflowSnapshot.delivered}
            />
            <ProgressRing
              percent={data.completionRate}
              label={t.analytics.completionRate}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent-500" />
              <p className="font-semibold text-slate-900">
                {data.viewMode === "week"
                  ? t.analytics.weekOverWeek
                  : t.analytics.monthOverMonth}
              </p>
            </div>
            <PeriodCompareCards
              currentLabel={
                data.viewMode === "week"
                  ? t.analytics.thisWeek
                  : t.analytics.thisMonth
              }
              previousLabel={
                data.viewMode === "week"
                  ? t.analytics.lastWeek
                  : t.analytics.lastMonth
              }
              current={data.selectedPeriod}
              previous={data.previousPeriod}
              formatRevenue={formatRs}
            />
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500">{t.analytics.revenue}</span>
                <span className="text-sm font-bold text-slate-900">
                  {formatTrend(data.periodComparison.revenueChangePercent)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500">{t.analytics.orders}</span>
                <span className="text-sm font-bold text-slate-900">
                  {formatTrend(data.periodComparison.ordersChangePercent)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-100 pt-3">
                <span className="text-sm text-slate-500">{t.analytics.outstanding}</span>
                <span className="text-sm font-bold text-amber-700">
                  {formatRs(data.outstandingBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="mb-4 flex items-center gap-2">
              <Shirt className="h-5 w-5 text-accent-500" />
              <h3 className="font-bold text-slate-900">{t.analytics.orderPipeline}</h3>
            </div>
            <div className="space-y-3">
              {statusItems.map((item) => {
                const pct =
                  statusTotal > 0
                    ? Math.round((item.value / statusTotal) * 100)
                    : 0;
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn("h-full rounded-full", item.color)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h3 className="font-bold text-slate-900">{t.analytics.topGarments}</h3>
            {data.topGarments.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">{t.analytics.noGarmentData}</p>
            ) : (
              <div className="mt-4 space-y-2">
                {data.topGarments.map((item, index) => (
                  <div
                    key={item.garmentType}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-xs font-bold text-accent-700">
                        {index + 1}
                      </span>
                      <span className="truncate text-sm font-semibold text-slate-800">
                        {item.garmentLabel}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-slate-700">
                      {formatRs(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
