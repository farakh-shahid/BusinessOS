"use client";

import type { ComponentType } from "react";
import {
  ArrowDownWideNarrow,
  CalendarDays,
  Clock,
  Flame,
  ListOrdered,
  Sparkles,
} from "lucide-react";
import type { Dictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Input } from "@/core/presentation/components/ui/input";
import type { OrderListSort } from "@/features/infrastructure/data/order-list-params";

interface OrderListControlsProps {
  t: Dictionary;
  sort: OrderListSort;
  dueFrom: string;
  dueTo: string;
  isRtl: boolean;
  onSortChange: (sort: OrderListSort) => void;
  onDueFromChange: (value: string) => void;
  onDueToChange: (value: string) => void;
  onClearDateRange: () => void;
}

const sortOptions: {
  value: OrderListSort;
  labelKey: keyof Dictionary["orderList"];
  icon: ComponentType<{ className?: string }>;
}[] = [
  { value: "workflow", labelKey: "sortWorkflow", icon: ListOrdered },
  { value: "newest", labelKey: "sortNewest", icon: Sparkles },
  { value: "due_asc", labelKey: "sortDueAsc", icon: Clock },
  { value: "due_desc", labelKey: "sortDueDesc", icon: ArrowDownWideNarrow },
  { value: "priority", labelKey: "sortPriority", icon: Flame },
  { value: "booking_desc", labelKey: "sortBookingDesc", icon: CalendarDays },
  { value: "booking_asc", labelKey: "sortBookingAsc", icon: CalendarDays },
];

export function OrderListControls({
  t,
  sort,
  dueFrom,
  dueTo,
  isRtl,
  onSortChange,
  onDueFromChange,
  onDueToChange,
  onClearDateRange,
}: OrderListControlsProps) {
  const hasDateFilter = Boolean(dueFrom || dueTo);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/80">
      <div className="border-b border-slate-100 bg-white px-4 py-3.5">
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wide text-slate-400",
            isRtl && "text-right",
          )}
        >
          {t.orderList.showOrdersBy}
        </p>
        <div
          className={cn(
            "mt-2.5 flex flex-wrap gap-2",
            isRtl && "flex-row-reverse justify-end",
          )}
        >
          {sortOptions.map(({ value, labelKey, icon: Icon }) => {
            const active = sort === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onSortChange(value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  isRtl && "flex-row-reverse",
                  active
                    ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50/60",
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    active ? "text-white" : "text-slate-400",
                  )}
                />
                {t.orderList[labelKey]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-3.5">
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-2",
            isRtl && "flex-row-reverse",
          )}
        >
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wide text-slate-400",
              isRtl && "text-right",
            )}
          >
            {t.orderList.deliveryDates}
          </p>
          {hasDateFilter ? (
            <button
              type="button"
              onClick={onClearDateRange}
              className="text-xs font-semibold text-brand-700 hover:text-brand-800"
            >
              {t.orderList.clearDates}
            </button>
          ) : null}
        </div>

        <p
          className={cn(
            "mt-1 text-xs text-slate-500",
            isRtl && "text-right",
          )}
        >
          {t.orderList.dateHint}
        </p>

        <div
          className={cn(
            "mt-3 grid gap-3 sm:grid-cols-2",
            isRtl && "direction-rtl",
          )}
        >
          <label className="block">
            <span
              className={cn(
                "mb-1 block text-sm font-medium text-slate-700",
                isRtl && "text-right",
              )}
            >
              {t.orderList.dueFrom}
            </span>
            <Input
              type="date"
              value={dueFrom}
              onChange={(e) => onDueFromChange(e.target.value)}
              className="h-10 bg-white"
            />
          </label>
          <label className="block">
            <span
              className={cn(
                "mb-1 block text-sm font-medium text-slate-700",
                isRtl && "text-right",
              )}
            >
              {t.orderList.dueTo}
            </span>
            <Input
              type="date"
              value={dueTo}
              min={dueFrom || undefined}
              onChange={(e) => onDueToChange(e.target.value)}
              className="h-10 bg-white"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
