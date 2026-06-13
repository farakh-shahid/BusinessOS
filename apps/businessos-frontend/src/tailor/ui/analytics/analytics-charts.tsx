"use client";

import { formatRs } from "./format";

const TREND_CHART_HEIGHT = 128;

export function HorizontalBarChart({
  title,
  subtitle,
  items,
  formatValue = formatRs,
}: {
  title: string;
  subtitle?: string;
  items: { label: string; value: number; subLabel?: string }[];
  formatValue?: (n: number) => string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4">
        <h3 className="font-bold text-slate-900">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">—</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const width = Math.max((item.value / max) * 100, 4);
            return (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium text-slate-700">
                    {item.label}
                  </span>
                  <span className="shrink-0 font-bold text-slate-900">
                    {formatValue(item.value)}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-400"
                  style={{ width: `${width}%` }}
                />
                </div>
                {item.subLabel ? (
                  <p className="mt-0.5 text-xs text-slate-400">{item.subLabel}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DualStatCompare({
  title,
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  leftSub,
  rightSub,
}: {
  title: string;
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
  leftSub?: string;
  rightSub?: string;
}) {
  const total = leftValue + rightValue;
  const leftPct = total > 0 ? Math.round((leftValue / total) * 100) : 0;
  const rightPct = total > 0 ? 100 - leftPct : 0;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-status-cutting-bg px-3 py-4 ring-1 ring-status-cutting/25">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9A6800]">
            {leftLabel}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{leftValue}</p>
          {leftSub ? (
            <p className="mt-1 text-xs text-[#9A6800]/80">{leftSub}</p>
          ) : null}
        </div>
        <div className="rounded-2xl bg-status-delivered-bg px-3 py-4 ring-1 ring-status-delivered/25">
          <p className="text-xs font-semibold uppercase tracking-wide text-status-delivered">
            {rightLabel}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{rightValue}</p>
          {rightSub ? (
            <p className="mt-1 text-xs text-status-delivered/80">{rightSub}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="bg-status-cutting transition-all"
          style={{ width: `${leftPct}%` }}
        />
        <div
          className="bg-status-delivered transition-all"
          style={{ width: `${rightPct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{leftPct}%</span>
        <span>{rightPct}%</span>
      </div>
    </div>
  );
}

export function PeriodCompareCards({
  currentLabel,
  previousLabel,
  current,
  previous,
  formatRevenue,
}: {
  currentLabel: string;
  previousLabel: string;
  current: { revenue: number; orders: number };
  previous: { revenue: number; orders: number };
  formatRevenue: (n: number) => string;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-700">
            {currentLabel}
          </p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatRevenue(current.revenue)}
          </p>
          <p className="text-sm text-slate-600">
            {current.orders} orders
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {previousLabel}
          </p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatRevenue(previous.revenue)}
          </p>
          <p className="text-sm text-slate-600">
            {previous.orders} orders
          </p>
        </div>
      </div>
    </div>
  );
}

export function MonthlyTrendChart({
  title,
  subtitle,
  points,
}: {
  title: string;
  subtitle?: string;
  points: { label: string; orders: number; revenue: number }[];
}) {
  const maxRevenue = Math.max(...points.map((p) => p.revenue), 1);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-6">
        <h3 className="font-bold text-slate-900">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {points.length === 0 ? (
        <p className="text-sm text-slate-500">—</p>
      ) : (
        <div
          className="grid items-end gap-1 sm:gap-2"
          style={{
            gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))`,
          }}
        >
          {points.map((point) => {
            const barHeight =
              point.revenue > 0
                ? Math.max(
                    Math.round((point.revenue / maxRevenue) * TREND_CHART_HEIGHT),
                    8,
                  )
                : 4;

            return (
              <div
                key={point.label}
                className="flex min-w-0 flex-col items-center gap-2"
              >
                <div
                  className="flex w-full flex-col justify-end"
                  style={{ height: TREND_CHART_HEIGHT }}
                >
                  <div
                    className={
                      point.revenue > 0
                        ? "mx-auto w-full max-w-10 rounded-t-xl bg-gradient-to-t from-accent-600 to-accent-400"
                        : "mx-auto w-full max-w-10 rounded-t-sm bg-slate-100"
                    }
                    style={{ height: barHeight }}
                    title={`${point.orders} orders · ${formatRs(point.revenue)}`}
                  />
                </div>
                <p className="w-full truncate text-center text-[10px] font-semibold text-slate-500 sm:text-xs">
                  {point.label}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
