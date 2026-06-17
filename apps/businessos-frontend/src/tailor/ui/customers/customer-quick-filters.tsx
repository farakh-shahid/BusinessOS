"use client";

import { SlidersHorizontal } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import type { CustomerListQuickFilterCounts } from "@business-os/tailor";
import { cn } from "@/core/presentation/lib/utils";
import {
  CUSTOMER_QUICK_FILTERS,
  countActiveCustomerFilters,
  type CustomerListSegment,
  type CustomerRegistrationFilter,
} from "@/tailor/infrastructure/data/customer-list-filters";
import { customerQuickFilterCount } from "@/tailor/infrastructure/data/customer-list-ui";

interface CustomerQuickFiltersProps {
  segment: CustomerListSegment;
  registration: CustomerRegistrationFilter;
  t: Dictionary;
  isRtl: boolean;
  filterCounts?: CustomerListQuickFilterCounts;
  onSegmentChange: (segment: CustomerListSegment) => void;
  onOpenFilters: () => void;
}

export function CustomerQuickFilters({
  segment,
  registration,
  t,
  isRtl,
  filterCounts,
  onSegmentChange,
  onOpenFilters,
}: CustomerQuickFiltersProps) {
  const activeFilterCount = countActiveCustomerFilters(registration);

  function label(key: CustomerListSegment): string {
    if (key === "") return t.customerFilters.all;
    if (key === "vip") return t.customers.tagVip;
    if (key === "new") return t.customers.tagNewCustomer;
    if (key === "regular") return t.customers.tagRegular;
    return t.customers.tagHasBalance;
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex items-center gap-2",
          isRtl && "flex-row-reverse",
        )}
      >
        <button
          type="button"
          onClick={onOpenFilters}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition-colors",
            activeFilterCount > 0
              ? "border-brand-700 bg-brand-50 text-brand-900"
              : "border-hairline bg-card text-foreground hover:border-brand-200",
            isRtl && "flex-row-reverse",
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {t.customerFilters.filtersButton}
          {activeFilterCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </button>

        <div className="-mx-1 min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className={cn(
              "flex w-max min-w-full gap-2 px-1",
              isRtl && "flex-row-reverse",
            )}
          >
            {CUSTOMER_QUICK_FILTERS.map((key) => {
              const active = segment === key;
              const count = filterCounts
                ? customerQuickFilterCount(filterCounts, key)
                : null;

              return (
                <button
                  key={key || "all"}
                  type="button"
                  onClick={() => onSegmentChange(key)}
                  className={cn(
                    "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition-colors",
                    active
                      ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                      : "border-hairline bg-card text-foreground hover:border-brand-200",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <span>{label(key)}</span>
                  {count !== null ? (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
