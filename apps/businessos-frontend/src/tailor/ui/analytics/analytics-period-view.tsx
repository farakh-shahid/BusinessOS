"use client";

import { Download, FileText } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import type {
  DailyAnalyticsPoint,
  GarmentAnalyticsItem,
  MonthlyTrendPoint,
  TailorAnalytics,
} from "@business-os/tailor";
import { cn } from "@/core/presentation/lib/utils";
import { AnalyticsCalendarPicker } from "./analytics-calendar-picker";
import {
  DualStatCompare,
  MonthlyTrendChart,
  PeriodCompareCards,
  StatsBarChart,
} from "./analytics-charts";
import { AnalyticsPanel, SectionTitle } from "./analytics-primitives";
import { formatRs, formatTrend } from "./format";

function ProgressRing({ percent, label }: { percent: number; label: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <AnalyticsPanel title={label}>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="var(--color-background, #f1f5f9)"
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
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
            {percent}%
          </span>
        </div>
        <p className="text-sm text-muted-slate">
          {percent}% {label.toLowerCase()}
        </p>
      </div>
    </AnalyticsPanel>
  );
}

export function AnalyticsPeriodView({
  data,
  t,
  isRtl,
  anchor,
  focusedDay,
  onSelectDay,
  onJumpToPeriod,
  onPrevious,
  onNext,
  onViewChange,
  onExportCsv,
  onExportPdf,
}: {
  data: TailorAnalytics;
  t: Dictionary;
  isRtl: boolean;
  anchor: string;
  focusedDay: string | null;
  onSelectDay: (date: string) => void;
  onJumpToPeriod: (date: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: "week" | "month") => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
}) {
  const statusTotal =
    data.statusBreakdown.pending +
    data.statusBreakdown.inProgress +
    data.statusBreakdown.ready +
    data.statusBreakdown.delivered +
    data.statusBreakdown.cancelled;

  const statusItems = [
    {
      label: t.analytics.statusPending,
      value: data.statusBreakdown.pending,
      color: "bg-status-booked",
    },
    {
      label: t.analytics.statusInProgress,
      value: data.statusBreakdown.inProgress,
      color: "bg-status-cutting",
    },
    {
      label: t.analytics.statusReady,
      value: data.statusBreakdown.ready,
      color: "bg-status-ready",
    },
    {
      label: t.analytics.statusDelivered,
      value: data.statusBreakdown.delivered,
      color: "bg-status-delivered",
    },
  ];

  const chartPoints = data.dailyBreakdown.map((d: DailyAnalyticsPoint) => ({
    label: d.dayLabel,
    sub: d.dateLabel,
    orders: d.orders,
    revenue: d.revenue,
    disabled: d.disabled,
  }));

  const periodKpis = [
    { label: t.analytics.revenue, value: formatRs(data.selectedPeriod.revenue) },
    { label: t.analytics.orders, value: String(data.selectedPeriod.orders) },
    {
      label: t.analytics.advance,
      value: formatRs(data.selectedPeriod.advanceCollected),
    },
    {
      label: t.analytics.totalCustomers,
      value: String(data.totalCustomers),
    },
  ];

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
          isRtl && "sm:flex-row-reverse",
        )}
      >
        <div className={cn(isRtl && "text-right")}>
          <p className="text-sm text-muted-slate">{t.analytics.periodDrillDownHint}</p>
          {data.focusLabel ? (
            <p className="mt-1 text-sm font-semibold text-analytics-select">
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
            onClick={onExportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-background"
          >
            <Download className="h-4 w-4" />
            {t.analytics.exportCsv}
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-3 py-2 text-sm font-semibold text-white hover:brightness-105"
          >
            <FileText className="h-4 w-4" />
            {t.analytics.exportPdf}
          </button>
        </div>
      </div>

      <AnalyticsCalendarPicker
        data={data}
        anchor={anchor}
        focusedDay={focusedDay}
        onSelectDay={onSelectDay}
        onJumpToPeriod={onJumpToPeriod}
        onPrevious={onPrevious}
        onNext={onNext}
        onViewChange={onViewChange}
      />

      <SectionTitle isRtl={isRtl}>{t.analytics.periodReports}</SectionTitle>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {periodKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-hairline bg-card p-3.5"
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-slate">
              {kpi.label}
            </p>
            <p className="mt-1.5 font-display text-xl font-bold text-foreground">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <StatsBarChart
          points={chartPoints}
          title={t.analytics.orderStatistics}
          subtitle={data.rangeLabel}
        />

        <AnalyticsPanel title={t.analytics.orderPipeline} isRtl={isRtl}>
          <div className="space-y-3">
            {statusItems.map((item) => {
              const pct =
                statusTotal > 0
                  ? Math.round((item.value / statusTotal) * 100)
                  : 0;
              return (
                <div key={item.label}>
                  <div
                    className={cn(
                      "mb-1 flex items-center justify-between text-sm",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    <span className="text-muted-slate">{item.label}</span>
                    <span className="font-bold text-foreground">{item.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className={cn("h-full rounded-full", item.color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AnalyticsPanel>
      </div>

      <SectionTitle isRtl={isRtl}>{t.analytics.periodComparison}</SectionTitle>
      <div className="grid gap-3.5 lg:grid-cols-2">
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

        <AnalyticsPanel
          title={
            data.viewMode === "week"
              ? t.analytics.weekOverWeek
              : t.analytics.monthOverMonth
          }
          isRtl={isRtl}
        >
          <div className="space-y-2">
            <div
              className={cn(
                "flex items-center justify-between gap-4 text-sm",
                isRtl && "flex-row-reverse",
              )}
            >
              <span className="text-muted-slate">{t.analytics.revenue}</span>
              <span className="font-bold text-foreground">
                {formatTrend(data.periodComparison.revenueChangePercent)}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center justify-between gap-4 text-sm",
                isRtl && "flex-row-reverse",
              )}
            >
              <span className="text-muted-slate">{t.analytics.orders}</span>
              <span className="font-bold text-foreground">
                {formatTrend(data.periodComparison.ordersChangePercent)}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center justify-between gap-4 border-t border-hairline pt-3 text-sm",
                isRtl && "flex-row-reverse",
              )}
            >
              <span className="text-muted-slate">{t.analytics.outstanding}</span>
              <span className="font-bold text-status-rush">
                {formatRs(data.outstandingBalance)}
              </span>
            </div>
          </div>
        </AnalyticsPanel>
      </div>

      <div className="mt-3.5 grid gap-3.5 lg:grid-cols-2">
        <MonthlyTrendChart
          title={t.analytics.revenueTrend}
          subtitle={t.analytics.lastSixMonths}
          points={data.monthlyTrend.map((m: MonthlyTrendPoint) => ({
            label: m.monthLabel,
            orders: m.orders,
            revenue: m.revenue,
          }))}
        />

        <AnalyticsPanel title={t.analytics.topGarments} isRtl={isRtl}>
          {data.topGarments.length === 0 ? (
            <p className="text-sm text-muted-slate">{t.analytics.noGarmentData}</p>
          ) : (
            <div className="space-y-2">
              {data.topGarments.map(
                (item: GarmentAnalyticsItem, index: number) => (
                  <div
                    key={item.garmentType}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl bg-background px-3 py-2.5",
                      isRtl && "flex-row-reverse",
                    )}
                  >
                    <div
                      className={cn(
                        "flex min-w-0 items-center gap-2",
                        isRtl && "flex-row-reverse",
                      )}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-xs font-bold text-accent-600">
                        {index + 1}
                      </span>
                      <span className="truncate text-sm font-semibold text-foreground">
                        {item.garmentLabel}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-foreground">
                      {formatRs(item.revenue)}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </AnalyticsPanel>
      </div>

      <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
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
    </div>
  );
}
