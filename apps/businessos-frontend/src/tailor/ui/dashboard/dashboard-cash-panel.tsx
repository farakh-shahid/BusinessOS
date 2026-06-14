"use client";

import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import type { DashboardCashSummary, DashboardCashWeekBucket } from "@business-os/tailor";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";

interface DashboardCashPanelProps {
  cash: DashboardCashSummary;
  t: Dictionary;
  isRtl?: boolean;
  className?: string;
}

function formatCash(amount: number): string {
  return `Rs ${Math.round(amount).toLocaleString()}`;
}

function formatCompactCash(amount: number): string {
  if (amount <= 0) return "—";
  if (amount >= 100_000) {
    return `Rs ${Math.round(amount / 1000)}k`;
  }
  if (amount >= 1000) {
    return `Rs ${(amount / 1000).toFixed(amount >= 10_000 ? 0 : 1)}k`;
  }
  return `Rs ${Math.round(amount)}`;
}

function formatTrend(percent: number | null): string {
  if (percent === null) return "—";
  const sign = percent > 0 ? "▲ " : percent < 0 ? "▼ " : "";
  return `${sign}${Math.abs(percent)}%`;
}

function weekLabel(week: number, t: Dictionary): string {
  return t.dashboard.cash.weekLabel.replace("{week}", String(week));
}

const MIN_BAR_PERCENT = 3;

function CashWeekChart({
  weeks,
  t,
  isRtl,
}: {
  weeks: DashboardCashWeekBucket[];
  t: Dictionary;
  isRtl?: boolean;
}) {
  const max = Math.max(...weeks.map((bucket) => bucket.amount), 1);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p
        className={cn(
          "mb-2 shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-slate",
          isRtl && "text-right",
        )}
      >
        {t.dashboard.cash.byWeek}
      </p>

      {/* Grows to fill card; bars sit on the bottom edge (above week labels) */}
      <div
        className={cn(
          "flex min-h-[72px] flex-1 items-end gap-1.5 pt-5",
          isRtl && "flex-row-reverse",
        )}
      >
        {weeks.map((bucket) => {
          const barPercent =
            bucket.amount > 0
              ? Math.max(Math.round((bucket.amount / max) * 100), 10)
              : MIN_BAR_PERCENT;

          return (
            <div
              key={bucket.week}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
            >
              <div
                className="relative flex w-full flex-1 flex-col justify-end"
              >
                <div
                  className={cn(
                    "relative w-full rounded-t-md transition-all",
                    bucket.isCurrent ? "bg-emerald-600" : "bg-emerald-100",
                  )}
                  style={{ height: `${barPercent}%` }}
                  title={formatCash(bucket.amount)}
                >
                  {bucket.amount > 0 ? (
                    <span
                      className={cn(
                        "absolute -top-4 left-0 right-0 text-center text-[9px] font-semibold tabular-nums leading-none",
                        bucket.isCurrent
                          ? "text-emerald-700"
                          : "text-muted-slate",
                      )}
                    >
                      {formatCompactCash(bucket.amount)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Week labels sit directly on the footer border */}
      <div
        className={cn(
          "mt-1.5 flex shrink-0 gap-1.5",
          isRtl && "flex-row-reverse",
        )}
      >
        {weeks.map((bucket) => (
          <div
            key={bucket.week}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5"
          >
            <span
              className={cn(
                "text-[9.5px] font-semibold leading-none",
                bucket.isCurrent ? "text-emerald-700" : "text-muted-slate",
              )}
            >
              {weekLabel(bucket.week, t)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardCashPanel({
  cash,
  t,
  isRtl = false,
  className,
}: DashboardCashPanelProps) {
  const trendPositive =
    cash.changePercent === null ? null : cash.changePercent >= 0;

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col rounded-2xl border border-hairline bg-card shadow-sm",
        className,
      )}
    >
      {/* Summary — pinned to top */}
      <div
        className={cn(
          "shrink-0 px-4 pb-3 pt-5 sm:px-[17px] sm:pt-[18px]",
          isRtl && "text-right",
        )}
      >
        <h2 className="font-display text-sm font-bold text-foreground">
          {t.dashboard.cash.title}
        </h2>

        <p
          className={cn(
            "mt-2.5 font-display text-[1.6875rem] font-bold leading-none text-emerald-600",
            isRtl && "text-right",
          )}
        >
          {formatCash(cash.collectedThisMonth)}
        </p>

        <p
          className={cn(
            "mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-muted-slate",
            isRtl && "flex-row-reverse justify-end",
          )}
        >
          <span>
            {t.dashboard.cash.deliveredCount.replace(
              "{count}",
              String(cash.deliveredThisMonth),
            )}
          </span>
          <span className="text-slate-300">·</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 font-semibold",
              trendPositive === null
                ? "text-muted-slate"
                : trendPositive
                  ? "text-emerald-600"
                  : "text-rose-600",
            )}
          >
            {trendPositive !== null && trendPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : null}
            {formatTrend(cash.changePercent)}{" "}
            {t.dashboard.cash.vsLastMonth}
          </span>
        </p>
      </div>

      {/* Chart fills middle; bars + labels sit flush above footer border */}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col px-4 pb-2 sm:px-[17px]",
          isRtl && "text-right",
        )}
      >
        <CashWeekChart weeks={cash.weeklyCollected} t={t} isRtl={isRtl} />
      </div>

      {/* Footer — border-top is the bar baseline */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-between gap-3 border-t border-hairline px-4 py-3 sm:px-[17px]",
          isRtl && "flex-row-reverse",
        )}
      >
        <span className="text-[11.5px] text-muted-slate">
          {t.dashboard.cash.outstanding}
        </span>
        <span className="font-display text-sm font-bold text-rose-600">
          {formatCash(cash.outstandingBalance)}
        </span>
        <Link
          href={routes.receivables}
          className={cn(
            "inline-flex shrink-0 items-center gap-0.5 text-[11.5px] font-semibold text-accent-500 transition hover:text-accent-600",
            isRtl && "flex-row-reverse",
          )}
        >
          {t.dashboard.cash.collect}
          <ChevronRight
            className={cn("h-3.5 w-3.5", isRtl && "rotate-180")}
            strokeWidth={2.5}
          />
        </Link>
      </div>
    </section>
  );
}
