"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Dictionary } from "@business-os/i18n";
import type { TailorAnalytics } from "@business-os/tailor";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";
import {
  formatRs,
  formatRsCompact,
  formatTrend,
} from "./format";
import { AnalyticsPanel, SectionTitle } from "./analytics-primitives";

type OverviewScope = "year" | "sixMonth" | "month";

export type { OverviewScope };

const AGING_COLORS = {
  current: "#12A36A",
  late_1_2w: "#F4A828",
  late_2w_plus: "#E5484D",
} as const;

const GARMENT_COLORS = [
  "#8B5CF6",
  "#FF6A2B",
  "#E5484D",
  "#3B6FF6",
  "#F4A828",
  "#6B7A99",
];

const KARIGAR_COLORS = ["#3B6FF6", "#8B5CF6", "#12A36A", "#F4A828", "#E5484D"];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function seasonTag(month: string, t: Dictionary): string | null {
  const monthNum = Number(month.split("-")[1]);
  if (monthNum === 3) return t.analytics.seasonPreEid;
  if (monthNum === 4) return t.analytics.seasonEid;
  if (monthNum === 6 || monthNum === 12) return t.analytics.seasonWedding;
  return null;
}

function InsightCard({
  variant,
  title,
  value,
  cta,
  href,
  onClick,
  isRtl,
}: {
  variant: "good" | "warn" | "info";
  title: string;
  value: string;
  cta: string;
  href?: string;
  onClick?: () => void;
  isRtl: boolean;
}) {
  const bg =
    variant === "good"
      ? "linear-gradient(120deg,#0d5b3f,#10805a)"
      : variant === "warn"
        ? "linear-gradient(120deg,#7a1f22,#a83339)"
        : "linear-gradient(120deg,var(--brand-900,#0E1A36),var(--brand-800,#1A2747))";

  const className = cn(
    "block min-w-[220px] flex-1 rounded-2xl p-4 text-white transition hover:brightness-105 sm:p-[17px]",
    isRtl && "text-right",
  );

  const content = (
    <>
      <p className="text-[11.5px] opacity-80">{title}</p>
      <p className="mt-1 font-display text-lg font-bold leading-snug">{value}</p>
      <p className="mt-2 text-[11.5px] font-semibold underline underline-offset-2 opacity-95">
        {cta}
      </p>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(className, "text-left")}
        style={{ background: bg }}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={href ?? "#"} className={className} style={{ background: bg }}>
      {content}
    </Link>
  );
}

function ScopeToggle({
  scope,
  onChange,
  t,
  isRtl,
}: {
  scope: OverviewScope;
  onChange: (scope: OverviewScope) => void;
  t: Dictionary;
  isRtl: boolean;
}) {
  const options: { key: OverviewScope; label: string }[] = [
    { key: "year", label: t.analytics.scopeYear },
    { key: "sixMonth", label: t.analytics.scopeSixMonths },
    { key: "month", label: t.analytics.scopeMonth },
  ];

  return (
    <div
      className={cn(
        "inline-flex rounded-[10px] border border-hairline bg-background p-0.5",
        isRtl && "flex-row-reverse",
      )}
    >
      {options.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            "rounded-[7px] px-3 py-1.5 text-xs font-semibold transition-colors",
            scope === key
              ? "bg-brand-900 text-white"
              : "text-muted-slate hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function AnalyticsOverview({
  data,
  t,
  isRtl,
  scope,
  onScopeChange,
  onGoToPeriod,
}: {
  data: TailorAnalytics;
  t: Dictionary;
  isRtl: boolean;
  scope: OverviewScope;
  onScopeChange: (scope: OverviewScope) => void;
  onGoToPeriod: () => void;
}) {

  const incomePoints = useMemo(() => {
    if (scope === "month") {
      const current = data.yearlyTrend.at(-1);
      return current ? [current] : [];
    }
    if (scope === "sixMonth") return data.yearlyTrend.slice(-6);
    return data.yearlyTrend;
  }, [data.yearlyTrend, scope]);

  const maxIncome = Math.max(...incomePoints.map((p) => p.revenue), 1);
  const peakRevenue = Math.max(...incomePoints.map((p) => p.revenue), 0);
  const totalGarmentOrders = Math.max(
    data.garmentBreakdown.reduce((sum, g) => sum + g.count, 0),
    1,
  );
  const maxGarmentRevenue = Math.max(
    ...data.garmentBreakdown.map((g) => g.revenue),
    1,
  );
  const maxBusiest = Math.max(...data.busiestDays.map((d) => d.orders), 1);
  const maxKarigar = Math.max(...data.karigarOutput.map((k) => k.pieces), 1);
  const agingTotal = Math.max(
    data.receivablesAging.reduce((sum, bucket) => sum + bucket.amount, 0),
    1,
  );
  const late2wAmount =
    data.receivablesAging.find((b) => b.key === "late_2w_plus")?.amount ?? 0;

  const incomeTrend = formatTrend(data.currentMonthComparison.revenueChangePercent);
  const avgOrderDelta =
    data.previousPeriod.orders > 0
      ? data.avgOrderValue -
        data.previousPeriod.revenue / data.previousPeriod.orders
      : 0;

  function agingLabel(key: TailorAnalytics["receivablesAging"][number]["key"]) {
    if (key === "current") return t.analytics.agingCurrent;
    if (key === "late_1_2w") return t.analytics.agingLate1_2w;
    return t.analytics.agingLate2wPlus;
  }

  function debtorNote(daysLate: number) {
    if (daysLate <= 0) return t.analytics.overdue;
    return t.analytics.daysLate.replace("{count}", String(daysLate));
  }

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          isRtl && "flex-row-reverse",
        )}
      >
          <ScopeToggle scope={scope} onChange={onScopeChange} t={t} isRtl={isRtl} />
      </div>

      <div
        className={cn(
          "mt-4 flex flex-wrap gap-3",
          isRtl && "flex-row-reverse",
        )}
      >
        <InsightCard
          variant="good"
          title={t.analytics.insightIncomeTitle}
          value={t.analytics.insightIncomeTrend
            .replace("{amount}", formatRsCompact(data.currentMonth.revenue))
            .replace("{trend}", incomeTrend)}
          cta={t.analytics.insightIncomeCta}
          onClick={onGoToPeriod}
          isRtl={isRtl}
        />
        <InsightCard
          variant="warn"
          title={t.analytics.insightOwedTitle}
          value={t.analytics.insightOwedValue
            .replace("{amount}", formatRsCompact(data.outstandingBalance))
            .replace("{count}", String(data.receivablesCustomersOwing))}
          cta={
            late2wAmount > 0
              ? t.analytics.insightOwedCta.replace(
                  "{amount}",
                  formatRsCompact(late2wAmount),
                )
              : t.analytics.insightOwedCtaNone
          }
          href={routes.receivables}
          isRtl={isRtl}
        />
        <InsightCard
          variant="info"
          title={t.analytics.insightPipelineTitle}
          value={t.analytics.insightPipelineValue
            .replace("{amount}", formatRsCompact(data.productionPipeline.totalValue))
            .replace("{count}", String(data.productionPipeline.orderCount))}
          cta={t.analytics.insightPipelineCta}
          href={routes.orders}
          isRtl={isRtl}
        />
      </div>

      <SectionTitle isRtl={isRtl}>{t.analytics.sectionMoney}</SectionTitle>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {[
          {
            label: t.analytics.kpiIncomeMonth,
            value: formatRsCompact(data.currentMonth.revenue),
            delta: incomeTrend,
            deltaClass: "text-status-ready",
            warn: false,
          },
          {
            label: t.analytics.kpiOwed,
            value: formatRsCompact(data.outstandingBalance),
            delta: t.analytics.kpiCustomersOwing.replace(
              "{count}",
              String(data.receivablesCustomersOwing),
            ),
            deltaClass: "text-status-rush",
            warn: true,
          },
          {
            label: t.analytics.kpiInProduction,
            value: formatRsCompact(data.productionPipeline.totalValue),
            delta: t.analytics.kpiNotDelivered,
            deltaClass: "text-muted-slate",
            warn: false,
          },
          {
            label: t.analytics.kpiAvgOrder,
            value: formatRs(data.avgOrderValue),
            delta:
              avgOrderDelta >= 0
                ? `▲ ${formatRs(Math.abs(avgOrderDelta))}`
                : `▼ ${formatRs(Math.abs(avgOrderDelta))}`,
            deltaClass: "text-status-ready",
            warn: false,
          },
          {
            label: t.analytics.kpiAdvanceTaken,
            value: `${data.advanceCollectionRate}%`,
            delta: t.analytics.kpiUpfront,
            deltaClass: "text-muted-slate",
            warn: false,
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={cn(
              "rounded-2xl border border-hairline bg-card p-3.5 sm:p-3.5",
              kpi.warn &&
                "border-status-rush/20 bg-gradient-to-b from-status-rush-bg to-card",
            )}
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-slate">
              {kpi.label}
            </p>
            <p className="mt-1.5 font-display text-xl font-bold text-foreground">
              {kpi.value}
            </p>
            <p className={cn("mt-0.5 text-[11px] font-semibold", kpi.deltaClass)}>
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3.5 grid items-stretch gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <AnalyticsPanel
          fill
          title={t.analytics.incomeByMonth}
          hint={t.analytics.incomeByMonthHint}
          isRtl={isRtl}
        >
          <div className="flex h-full min-h-44 items-end gap-2">
            {incomePoints.map((point) => {
              const tag = seasonTag(point.month, t);
              const isPeak = point.revenue === peakRevenue && point.revenue > 0;
              const height = Math.max((point.revenue / maxIncome) * 100, 6);

              return (
                <div
                  key={point.month}
                  className="flex h-full min-w-0 flex-1 flex-col items-center"
                >
                  <div className="flex min-h-0 w-full flex-1 flex-col justify-end">
                    <div
                      className={cn(
                        "relative w-full min-h-[5px] rounded-t-md",
                        isPeak ? "bg-accent-500" : "bg-accent-500/35",
                      )}
                      style={{ height: `${height}%` }}
                    >
                      {tag ? (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-accent-500 px-1.5 py-0.5 text-[8.5px] font-bold text-white">
                          {tag}
                        </span>
                      ) : null}
                      <span className="absolute -top-4 left-0 right-0 text-center font-display text-[9.5px] font-bold text-foreground">
                        {formatRsCompact(point.revenue)}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 pt-1.5 text-[9.5px] text-muted-slate">
                    {point.monthLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </AnalyticsPanel>

        <AnalyticsPanel
          title={t.analytics.outstandingPanel}
          isRtl={isRtl}
          action={
            <Link
              href={routes.receivables}
              className="text-[11px] font-semibold text-accent-500"
            >
              {t.analytics.collectLink} ›
            </Link>
          }
        >
          <div className="mb-3 flex h-[22px] overflow-hidden rounded-lg">
            {data.receivablesAging.map((bucket) => (
              <div
                key={bucket.key}
                style={{
                  width: `${(bucket.amount / agingTotal) * 100}%`,
                  background: AGING_COLORS[bucket.key],
                }}
              />
            ))}
          </div>
          <div
            className={cn(
              "mb-3 flex flex-wrap gap-3 text-[11.5px]",
              isRtl && "flex-row-reverse",
            )}
          >
            {data.receivablesAging.map((bucket) => (
              <div
                key={bucket.key}
                className={cn(
                  "flex items-center gap-1.5",
                  isRtl && "flex-row-reverse",
                )}
              >
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: AGING_COLORS[bucket.key] }}
                />
                <span>
                  {agingLabel(bucket.key)}{" "}
                  <b className="font-display">{formatRs(bucket.amount)}</b>
                </span>
              </div>
            ))}
          </div>
          {data.topDebtors.length === 0 ? (
            <p className="text-sm text-muted-slate">{t.analytics.noDebtors}</p>
          ) : (
            data.topDebtors.map((debtor) => (
              <div
                key={debtor.customerId}
                className={cn(
                  "flex items-center gap-3 border-b border-hairline py-2.5 last:border-b-0",
                  isRtl && "flex-row-reverse",
                )}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                  style={{
                    background:
                      debtor.daysLate >= 14
                        ? AGING_COLORS.late_2w_plus
                        : debtor.daysLate > 0
                          ? AGING_COLORS.late_1_2w
                          : AGING_COLORS.current,
                  }}
                >
                  {initials(debtor.customerName)}
                </div>
                <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
                  <p className="text-xs font-semibold text-foreground">
                    <PersonNameText name={debtor.customerName} />
                  </p>
                  <p className="text-[10.5px] text-status-rush">
                    {debtorNote(debtor.daysLate)}
                  </p>
                </div>
                <p className="shrink-0 text-right font-display text-sm font-bold">
                  {formatRs(debtor.balance)}
                </p>
              </div>
            ))
          )}
        </AnalyticsPanel>
      </div>

      <SectionTitle isRtl={isRtl}>{t.analytics.sectionEarnsBusy}</SectionTitle>
      <div className="grid items-stretch gap-3.5 lg:grid-cols-2">
        <AnalyticsPanel
          title={t.analytics.revenueByGarment}
          hint={t.analytics.revenueByGarmentShare}
          isRtl={isRtl}
        >
          {data.garmentBreakdown.length === 0 ? (
            <p className="text-sm text-muted-slate">{t.analytics.noGarmentData}</p>
          ) : (
            data.garmentBreakdown.map((garment, index) => {
              const share = Math.round((garment.count / totalGarmentOrders) * 100);
              const color = GARMENT_COLORS[index % GARMENT_COLORS.length];
              const width = Math.max((garment.revenue / maxGarmentRevenue) * 100, 16);

              return (
                <div
                  key={garment.garmentType}
                  className={cn(
                    "mb-2.5 flex items-center gap-3",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <span className="w-24 shrink-0 truncate text-xs font-semibold">
                    {garment.garmentLabel}
                  </span>
                  <div className="h-[18px] flex-1 overflow-hidden rounded-md bg-background">
                    <div
                      className="flex h-full items-center justify-end rounded-md pr-1.5"
                      style={{ width: `${width}%`, background: color }}
                    >
                      <span className="font-display text-[10.5px] font-bold text-white">
                        {formatRsCompact(garment.revenue)}
                      </span>
                    </div>
                  </div>
                  <span className="w-9 shrink-0 text-right text-[10.5px] text-muted-slate">
                    {share}%
                  </span>
                </div>
              );
            })
          )}
          <p className="mt-2 rounded-lg bg-background px-3 py-2 text-[11.5px] text-muted-slate">
            {t.analytics.garmentInsight}
          </p>
        </AnalyticsPanel>

        <AnalyticsPanel
          fill
          title={t.analytics.busiestDays}
          hint={t.analytics.busiestDaysHint}
          isRtl={isRtl}
        >
          <div className="flex h-full min-h-44 items-end gap-2">
            {data.busiestDays.map((day) => {
              const isPeak = day.orders === maxBusiest && day.orders > 0;
              return (
                <div
                  key={day.dayKey}
                  className="flex h-full min-w-0 flex-1 flex-col items-center"
                >
                  <div className="flex min-h-0 w-full flex-1 flex-col justify-end">
                    <div
                      className={cn(
                        "relative w-full min-h-[5px] rounded-t-md",
                        isPeak ? "bg-accent-500" : "bg-accent-500/35",
                      )}
                      style={{
                        height: `${Math.max((day.orders / maxBusiest) * 100, 6)}%`,
                      }}
                    >
                      <span className="absolute -top-4 left-0 right-0 text-center font-display text-[9.5px] font-bold">
                        {day.orders}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 pt-1.5 text-[9.5px] text-muted-slate">
                    {day.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </AnalyticsPanel>
      </div>

      <SectionTitle isRtl={isRtl}>{t.analytics.sectionKarigarsCustomers}</SectionTitle>
      <div className="grid gap-3.5 lg:grid-cols-2">
        <AnalyticsPanel
          title={t.analytics.karigarOutput}
          hint={t.analytics.karigarHint}
          isRtl={isRtl}
        >
          {data.karigarOutput.length === 0 ? (
            <p className="text-sm text-muted-slate">{t.analytics.noKarigarData}</p>
          ) : (
            data.karigarOutput.map((karigar, index) => (
              <div
                key={karigar.name}
                className={cn(
                  "mb-2.5 flex items-center gap-3",
                  isRtl && "flex-row-reverse",
                )}
              >
                <span className="w-24 shrink-0 truncate text-xs font-semibold">
                  <PersonNameText name={karigar.name} />
                </span>
                <div className="h-[18px] flex-1 overflow-hidden rounded-md bg-background">
                  <div
                    className="flex h-full items-center justify-end rounded-md pr-1.5"
                    style={{
                      width: `${Math.max((karigar.pieces / maxKarigar) * 100, 16)}%`,
                      background: KARIGAR_COLORS[index % KARIGAR_COLORS.length],
                    }}
                  >
                    <span className="font-display text-[10.5px] font-bold text-white">
                      {karigar.pieces} pcs
                    </span>
                  </div>
                </div>
                <span className="w-16 shrink-0 text-right font-display text-[11px] font-semibold text-muted-slate">
                  {formatRsCompact(karigar.revenue)}
                </span>
              </div>
            ))
          )}
          <p className="mt-2 rounded-lg bg-background px-3 py-2 text-[11.5px] text-muted-slate">
            {t.analytics.karigarNote}
          </p>
        </AnalyticsPanel>

        <AnalyticsPanel
          title={t.analytics.topCustomers}
          hint={t.analytics.topCustomersHint}
          isRtl={isRtl}
        >
          {data.topCustomers.length === 0 ? (
            <p className="text-sm text-muted-slate">{t.analytics.topCustomersEmpty}</p>
          ) : (
            data.topCustomers.map((customer, index) => (
              <div
                key={customer.customerId}
                className={cn(
                  "flex items-center gap-3 border-b border-hairline py-2.5 last:border-b-0",
                  isRtl && "flex-row-reverse",
                )}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                  style={{ background: GARMENT_COLORS[index % GARMENT_COLORS.length] }}
                >
                  {initials(customer.customerName)}
                </div>
                <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
                  <p className="text-xs font-semibold">
                    <PersonNameText name={customer.customerName} />
                  </p>
                  <p className="text-[10.5px] text-muted-slate">
                    {t.analytics.customerOrders.replace(
                      "{count}",
                      String(customer.orderCount),
                    )}
                  </p>
                </div>
                <p className="shrink-0 font-display text-sm font-bold">
                  {formatRs(customer.revenue)}
                </p>
              </div>
            ))
          )}
        </AnalyticsPanel>
      </div>
    </div>
  );
}
