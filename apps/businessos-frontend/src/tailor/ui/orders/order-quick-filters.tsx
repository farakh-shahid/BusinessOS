"use client";

import { CalendarDays, SlidersHorizontal, X } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import type { OrderListFilter } from "@/tailor/infrastructure/data/order-filters";
import {
  countActiveOrderFilters,
  formatOrderDeliveryDateRange,
} from "@/tailor/infrastructure/data/order-list-ui";
import type { OrderListParams } from "@/tailor/infrastructure/data/order-list-params";
import { useLocale } from "@/core/i18n/locale-context";

const QUICK_FILTERS: OrderListFilter[] = [
  "",
  "booked_today",
  "booked_last_week",
  "overdue",
  "due_today",
  "ready",
  "delivered",
];

interface OrderQuickFiltersProps {
  params: OrderListParams;
  t: Dictionary;
  isRtl: boolean;
  onFilterChange: (filter: OrderListFilter) => void;
  onOpenSheet: () => void;
  onOpenDateSheet: () => void;
  onClearDeliveryDates: () => void;
  trailing?: React.ReactNode;
}

export function OrderQuickFilters({
  params,
  t,
  isRtl,
  onFilterChange,
  onOpenSheet,
  onOpenDateSheet,
  onClearDeliveryDates,
  trailing,
}: OrderQuickFiltersProps) {
  const { locale } = useLocale();
  const activeCount = countActiveOrderFilters(params);
  const hasDeliveryDates = Boolean(params.dueFrom || params.dueTo);
  const deliveryDateLabel = hasDeliveryDates
    ? formatOrderDeliveryDateRange(
        params.dueFrom,
        params.dueTo,
        locale,
        t,
      )
    : "";

  function quickLabel(key: OrderListFilter): string {
    if (key === "") return t.orderFilters.all;
    if (key === "booked_today") return t.orderList.bookedTodayShort;
    if (key === "booked_last_week") return t.orderList.bookedWeekShort;
    if (key === "due_today") return t.orderList.todayShort;
    if (key === "ready") return t.orderList.readyShort;
    if (key === "delivered") return t.orderList.deliveredShort;
    return t.orderFilters[key];
  }

  function isQuickActive(key: OrderListFilter): boolean {
    return params.filter === key;
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          isRtl && "flex-row-reverse",
        )}
      >
        <button
          type="button"
          onClick={onOpenSheet}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-xl border border-hairline bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm",
            isRtl && "flex-row-reverse",
          )}
        >
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          {t.orderList.filtersButton}
          {activeCount > 0 ? (
            <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          ) : null}
        </button>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={onOpenDateSheet}
            aria-label={
              hasDeliveryDates
                ? `${t.orderList.deliveryDateTitle}: ${deliveryDateLabel}`
                : t.orderList.deliveryDateTitle
            }
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl border border-hairline bg-card text-foreground shadow-sm transition hover:border-brand-200",
              hasDeliveryDates
                ? "border-brand-300 bg-brand-50 py-2 pl-2.5 pr-8"
                : "p-2",
              isRtl && "flex-row-reverse pl-8 pr-2.5",
            )}
          >
            <CalendarDays
              className={cn(
                "h-4 w-4 shrink-0",
                hasDeliveryDates ? "text-brand-700" : "text-slate-500",
              )}
            />
            {hasDeliveryDates ? (
              <span className="max-w-[9.5rem] truncate text-xs font-semibold text-brand-800 sm:max-w-none sm:text-sm">
                {deliveryDateLabel}
              </span>
            ) : null}
          </button>
          {hasDeliveryDates ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClearDeliveryDates();
              }}
              aria-label={t.orderList.clearDates}
              className={cn(
                "absolute top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 shadow-sm transition hover:bg-brand-50",
                isRtl ? "left-1.5" : "right-1.5",
              )}
            >
              <X className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-2",
          isRtl && "flex-row-reverse",
        )}
      >
        <div className="-mx-1 min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className={cn(
              "flex w-max min-w-full gap-2 px-1",
              isRtl && "flex-row-reverse",
            )}
          >
            {QUICK_FILTERS.map((key) => {
              const active = isQuickActive(key);

              return (
                <button
                  key={key || "all"}
                  type="button"
                  onClick={() => onFilterChange(key)}
                  className={cn(
                    "shrink-0 cursor-pointer rounded-full border px-4 py-2 text-xs font-bold transition-colors",
                    active
                      ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                      : "border-hairline bg-card text-foreground hover:border-brand-200",
                  )}
                >
                  {quickLabel(key)}
                </button>
              );
            })}
          </div>
        </div>

        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </div>
  );
}
