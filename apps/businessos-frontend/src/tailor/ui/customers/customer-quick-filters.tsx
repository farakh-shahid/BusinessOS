"use client";

import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import {
  CUSTOMER_QUICK_FILTERS,
  type CustomerListSegment,
} from "@/tailor/infrastructure/data/customer-list-filters";

interface CustomerQuickFiltersProps {
  segment: CustomerListSegment;
  t: Dictionary;
  isRtl: boolean;
  onSegmentChange: (segment: CustomerListSegment) => void;
}

export function CustomerQuickFilters({
  segment,
  t,
  isRtl,
  onSegmentChange,
}: CustomerQuickFiltersProps) {
  function label(key: CustomerListSegment): string {
    if (key === "") return t.customerFilters.all;
    if (key === "vip") return t.customers.tagVip;
    if (key === "new") return t.customers.tagNewCustomer;
    if (key === "regular") return t.customers.tagRegular;
    if (key === "has_balance") return t.customers.tagHasBalance;
    return t.customerFilters.hasMeasurements;
  }

  return (
    <div className="-mx-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className={cn(
          "flex w-max min-w-full gap-2 px-1",
          isRtl && "flex-row-reverse",
        )}
      >
        {CUSTOMER_QUICK_FILTERS.map((key) => {
          const active = segment === key;
          return (
            <button
              key={key || "all"}
              type="button"
              onClick={() => onSegmentChange(key)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                active
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-hairline bg-card text-muted-slate hover:border-slate-300 hover:text-foreground",
              )}
            >
              {label(key)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
