"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronRight, Shirt } from "lucide-react";
import type {
  ProductionPerformanceData,
  ProductionPerformanceRow,
} from "@shared";
import type { Dictionary } from "@/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { Input } from "@/core/presentation/components/ui/input";
import { getAvatarPaletteClass } from "@/core/presentation/lib/avatar-utils";
import {
  nameInitials,
  PERFORMANCE_DATE_PRESETS,
  performancePresetLabelKey,
  type PerformanceDatePreset,
} from "@/features/infrastructure/data/assignment-board-utils";
import { formatOrderDeliveryDateRange } from "@/features/infrastructure/data/order-list-ui";
import { StaffNameWithBadges } from "@/core/presentation/components/ui/staff-identity-badges";
import { OrderWorkflowStatusBadge } from "@/features/ui/orders/order-workflow-status-badge";

interface AssignmentPerformanceViewProps {
  data: ProductionPerformanceData;
  datePreset: PerformanceDatePreset;
  from: string;
  to: string;
  selectedWorker: string | null;
  onPresetChange: (preset: PerformanceDatePreset) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onApplyRange: () => void;
  onClearRange: () => void;
  onSelectWorker: (workerName: string | null) => void;
  t: Dictionary;
  isRtl: boolean;
}

function PerformanceDateField({
  label,
  value,
  min,
  onChange,
  isRtl,
}: {
  label: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
  isRtl?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span
        className={cn(
          "mb-1.5 block text-[11px] font-medium text-muted-slate",
          isRtl && "text-right",
        )}
      >
        {label}
      </span>
      <div className="relative">
        <CalendarDays
          className={cn(
            "pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-brand-700",
            isRtl ? "right-3" : "left-3",
          )}
          aria-hidden
        />
        <Input
          type="date"
          value={value}
          min={min}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "bg-background",
            isRtl ? "pr-10 text-right" : "pl-10",
          )}
        />
      </div>
    </label>
  );
}

function SummaryCard({
  label,
  value,
  isRtl,
}: {
  label: string;
  value: number;
  isRtl?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-hairline bg-background px-3 py-2.5",
        isRtl && "text-right",
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-slate">
        {label}
      </p>
      <p className="mt-0.5 font-display text-xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

function PerformanceStatBlock({
  label,
  count,
  isRtl,
}: {
  label: string;
  count: number;
  isRtl?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-[5.25rem] rounded-[10px] border border-hairline bg-slate-50/80 px-2.5 py-2",
        isRtl ? "text-right" : "text-left",
      )}
    >
      <p className="text-[10px] font-medium leading-snug text-muted-slate">
        {label}
      </p>
      <p className="mt-0.5 font-display text-lg font-bold tabular-nums leading-none text-foreground">
        {count}
      </p>
    </div>
  );
}

function WorkerPerformanceStats({
  row,
  t,
  isRtl,
  className,
}: {
  row: ProductionPerformanceRow;
  t: Dictionary;
  isRtl?: boolean;
  className?: string;
}) {
  const stats = [
    {
      key: "booked",
      label: t.assignments.performanceSuitsBooked,
      count: row.bookedSuits,
    },
    {
      key: "cutting",
      label: t.assignments.performanceSuitsCut,
      count: row.cutSuits,
    },
    {
      key: "stitching",
      label: t.assignments.performanceSuitsStitched,
      count: row.stitchedSuits,
    },
  ].filter((stat) => stat.count > 0);

  if (stats.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        isRtl && "flex-row-reverse justify-end",
        className,
      )}
    >
      {stats.map((stat) => (
        <PerformanceStatBlock
          key={stat.key}
          label={stat.label}
          count={stat.count}
          isRtl={isRtl}
        />
      ))}
    </div>
  );
}

function PerformanceActiveRangeBanner({
  from,
  to,
  datePreset,
  t,
  isRtl,
  locale,
}: {
  from?: string;
  to?: string;
  datePreset: PerformanceDatePreset;
  t: Dictionary;
  isRtl?: boolean;
  locale: string;
}) {
  const rangeText =
    from?.trim() || to?.trim()
      ? formatOrderDeliveryDateRange(from ?? "", to ?? "", locale, t)
      : null;

  const label = rangeText
    ? t.assignments.performanceShowingResults.replace("{range}", rangeText)
    : datePreset === "all_time"
      ? t.assignments.performanceShowingAllTime
      : null;

  if (!label) return null;

  return (
    <div
      className={cn(
        "mt-3 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5",
        isRtl && "flex-row-reverse text-right",
      )}
      role="status"
    >
      <CalendarDays className="h-4 w-4 shrink-0 text-brand-700" aria-hidden />
      <p className="text-sm font-semibold text-brand-800">{label}</p>
    </div>
  );
}

function StaffPerformanceCard({
  row,
  onSelect,
  t,
  isRtl,
}: {
  row: ProductionPerformanceRow;
  onSelect: () => void;
  t: Dictionary;
  isRtl: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex h-full w-full flex-col rounded-[13px] border border-hairline bg-card p-4 text-left transition-all hover:border-brand-200 hover:shadow-md",
        isRtl && "text-right",
      )}
    >
      <div
        className={cn(
          "flex items-start justify-between gap-3",
          isRtl && "flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-center gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
              getAvatarPaletteClass(row.workerName),
            )}
          >
            {nameInitials(row.workerName)}
          </div>
          <div className="min-w-0">
            <StaffNameWithBadges
              name={row.workerName}
              t={t}
              isRtl={isRtl}
              nameClassName="font-display text-base font-bold text-foreground"
            />
            <p
              className={cn(
                "mt-0.5 truncate text-xs",
                row.specialty?.trim()
                  ? "text-muted-slate"
                  : "italic text-muted-slate/80",
              )}
            >
              {row.specialty?.trim() || t.staff.specialtyEmpty}
            </p>
          </div>
        </div>
      </div>

      <WorkerPerformanceStats row={row} t={t} isRtl={isRtl} className="mt-3" />

      <div
        className={cn(
          "mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs font-semibold text-brand-700",
          isRtl && "flex-row-reverse",
        )}
      >
        <span>{t.assignments.performanceViewOrders}</span>
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform group-hover:translate-x-0.5",
            isRtl && "rotate-180 group-hover:-translate-x-0.5",
          )}
        />
      </div>
    </button>
  );
}

function PerformanceOrderRow({
  order,
  t,
  isRtl,
}: {
  order: ProductionPerformanceData["orders"][number];
  t: Dictionary;
  isRtl: boolean;
}) {
  return (
    <Link
      href={routes.orderDetail(order.id)}
      className={cn(
        "group flex items-center gap-3 rounded-[12px] border border-hairline bg-card px-3.5 py-3 transition-all hover:border-brand-200 hover:shadow-sm",
        isRtl && "flex-row-reverse text-right",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-bold text-brand-700">
          #{order.orderNumber}
        </p>
        <p className="mt-0.5 truncate font-semibold text-foreground">
          {order.customerName}
        </p>
        <p
          className={cn(
            "mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-slate",
            isRtl && "flex-row-reverse justify-end",
          )}
        >
          <Shirt className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            {order.suitCount}x {order.garmentLabel}
          </span>
          <span aria-hidden>·</span>
          <span dir="ltr">
            {t.assignments.performanceBookedOn}: {order.bookingDate}
          </span>
        </p>
      </div>
      <OrderWorkflowStatusBadge workflowStatus={order.workflowStatus} t={t} />
      <ChevronRight
        className={cn(
          "h-4 w-4 shrink-0 text-brand-700 transition-transform group-hover:translate-x-0.5",
          isRtl && "rotate-180 group-hover:-translate-x-0.5",
        )}
        aria-hidden
      />
    </Link>
  );
}

export function AssignmentPerformanceView({
  data,
  datePreset,
  from,
  to,
  selectedWorker,
  onPresetChange,
  onFromChange,
  onToChange,
  onApplyRange,
  onClearRange,
  onSelectWorker,
  t,
  isRtl,
}: AssignmentPerformanceViewProps) {
  const selectedRow = selectedWorker
    ? data.staff.find((row) => row.workerName === selectedWorker)
    : null;

  return (
    <div className="space-y-4">
      <div className="rounded-[13px] border border-hairline bg-card p-4 lg:p-5">
        <div
          className={cn(
            "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
            isRtl && "lg:flex-row-reverse",
          )}
        >
          <div className={cn("min-w-0 lg:max-w-md", isRtl && "text-right")}>
            <h2 className="font-display text-base font-bold text-foreground">
              {t.assignments.performanceDateTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-slate">
              {t.assignments.performanceDateHint}
            </p>
          </div>

          <div className="lg:shrink-0">
            <SummaryCard
              label={t.assignments.performanceBookedSuits}
              value={data.totals.bookedSuits}
              isRtl={isRtl}
            />
          </div>
        </div>

        <div
          className={cn(
            "mt-4 flex flex-wrap gap-2",
            isRtl && "flex-row-reverse",
          )}
        >
          {PERFORMANCE_DATE_PRESETS.map((preset) => {
            const active = datePreset === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  if (preset === "all_time") {
                    onClearRange();
                    return;
                  }
                  onPresetChange(preset);
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "bg-brand-700 text-white shadow-sm"
                    : "border border-hairline bg-background text-muted-slate hover:border-brand-200 hover:text-foreground",
                )}
              >
                {t.assignments[performancePresetLabelKey(preset)]}
              </button>
            );
          })}
        </div>

        {datePreset === "custom" ? (
          <>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PerformanceDateField
                label={t.orderList.dueFrom}
                value={from}
                onChange={onFromChange}
                isRtl={isRtl}
              />
              <PerformanceDateField
                label={t.orderList.dueTo}
                value={to}
                min={from || undefined}
                onChange={onToChange}
                isRtl={isRtl}
              />
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={onApplyRange}
                className="w-full rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 sm:w-auto"
              >
                {t.orderList.applyFilters}
              </button>
            </div>
          </>
        ) : null}

        <PerformanceActiveRangeBanner
          from={data.from}
          to={data.to}
          datePreset={datePreset}
          t={t}
          isRtl={isRtl}
          locale={isRtl ? "ur" : "en"}
        />
      </div>

      {selectedRow ? (
        <div className="space-y-3">
          <div className="rounded-[13px] border border-hairline bg-card p-4">
            <button
              type="button"
              onClick={() => onSelectWorker(null)}
              className={cn(
                "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-hairline bg-background px-3 py-2.5 text-xs font-semibold text-muted-slate sm:w-auto",
                isRtl && "flex-row-reverse",
              )}
            >
              <ArrowLeft className={cn("h-4 w-4", isRtl && "rotate-180")} />
              {t.assignments.performanceAllStaff}
            </button>

            <div
              className={cn(
                "mt-3 flex items-center gap-3",
                isRtl && "flex-row-reverse",
              )}
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                  getAvatarPaletteClass(selectedRow.workerName),
                )}
              >
                {nameInitials(selectedRow.workerName)}
              </div>
              <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
                <StaffNameWithBadges
                  name={selectedRow.workerName}
                  t={t}
                  isRtl={isRtl}
                  nameClassName="font-display text-lg font-bold"
                />
                <p
                  className={cn(
                    "mt-0.5 text-sm",
                    selectedRow.specialty?.trim()
                      ? "text-muted-slate"
                      : "italic text-muted-slate/80",
                  )}
                >
                  {selectedRow.specialty?.trim() || t.staff.specialtyEmpty}
                </p>
                <WorkerPerformanceStats
                  row={selectedRow}
                  t={t}
                  isRtl={isRtl}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <PerformanceOrderList orders={data.orders} t={t} isRtl={isRtl} />
        </div>
      ) : (
        <PerformanceStaffList
          staff={data.staff}
          onSelectWorker={onSelectWorker}
          t={t}
          isRtl={isRtl}
        />
      )}
    </div>
  );
}

function PerformanceStaffList({
  staff,
  onSelectWorker,
  t,
  isRtl,
}: {
  staff: ProductionPerformanceRow[];
  onSelectWorker: (workerName: string) => void;
  t: Dictionary;
  isRtl: boolean;
}) {
  if (staff.length === 0) {
    return (
      <div className="rounded-[13px] border border-dashed border-hairline bg-card px-4 py-8 text-center text-sm text-muted-slate">
        {t.assignments.performanceNoOrders}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-0.5",
          isRtl && "flex-row-reverse",
        )}
      >
        <h3 className="font-display text-sm font-bold text-foreground">
          {t.assignments.performanceTeamHeading}
        </h3>
        <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-slate ring-1 ring-hairline">
          {staff.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {staff.map((row) => (
          <StaffPerformanceCard
            key={row.workerName}
            row={row}
            onSelect={() => onSelectWorker(row.workerName)}
            t={t}
            isRtl={isRtl}
          />
        ))}
      </div>
    </div>
  );
}

function PerformanceOrderList({
  orders,
  t,
  isRtl,
}: {
  orders: ProductionPerformanceData["orders"];
  t: Dictionary;
  isRtl: boolean;
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-[13px] border border-dashed border-hairline bg-card px-4 py-8 text-center text-sm text-muted-slate">
        {t.assignments.performanceNoOrders}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-0.5",
          isRtl && "flex-row-reverse",
        )}
      >
        <h3 className="font-display text-sm font-bold text-foreground">
          {t.assignments.performanceOrdersHeading}
        </h3>
        <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-slate ring-1 ring-hairline">
          {orders.length}
        </span>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <PerformanceOrderRow
            key={order.id}
            order={order}
            t={t}
            isRtl={isRtl}
          />
        ))}
      </div>
    </div>
  );
}
