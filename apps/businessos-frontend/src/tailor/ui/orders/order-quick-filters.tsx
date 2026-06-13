"use client";

import { SlidersHorizontal } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import type { OrderListFilter } from "@/tailor/infrastructure/data/order-filters";
import { countActiveOrderFilters } from "@/tailor/infrastructure/data/order-list-ui";
import type { OrderListParams } from "@/tailor/infrastructure/data/order-list-params";

const QUICK_FILTERS: OrderListFilter[] = [
  "",
  "overdue",
  "due_today",
  "ready",
  "delivered",
  "due_this_week",
];

interface OrderQuickFiltersProps {
  params: OrderListParams;
  t: Dictionary;
  isRtl: boolean;
  onFilterChange: (filter: OrderListFilter) => void;
  onOpenSheet: () => void;
}

export function OrderQuickFilters({
  params,
  t,
  isRtl,
  onFilterChange,
  onOpenSheet,
}: OrderQuickFiltersProps) {
  const activeCount = countActiveOrderFilters(params);

  function quickLabel(key: OrderListFilter): string {
    if (key === "") return t.orderFilters.all;
    if (key === "due_today") return t.orderList.todayShort;
    if (key === "due_this_week") return t.orderList.weekShort;
    if (key === "ready") return t.orderList.readyShort;
    if (key === "delivered") return t.orderList.deliveredShort;
    return t.orderFilters[key];
  }

  function isQuickActive(key: OrderListFilter): boolean {
    return params.filter === key;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onOpenSheet}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm",
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

      <div className="-mx-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  "shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors",
                  active
                    ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-brand-200",
                )}
              >
                {quickLabel(key)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
