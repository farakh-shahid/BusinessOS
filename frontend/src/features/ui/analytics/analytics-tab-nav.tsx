"use client";

import { BarChart3, CalendarRange } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";

export type AnalyticsTab = "overview" | "period";

interface AnalyticsTabNavProps {
  tab: AnalyticsTab;
  t: Dictionary;
  isRtl?: boolean;
  onChange: (tab: AnalyticsTab) => void;
}

const tabs: {
  value: AnalyticsTab;
  labelKey: "viewOverview" | "viewPeriod";
  icon: typeof BarChart3;
}[] = [
  { value: "overview", labelKey: "viewOverview", icon: BarChart3 },
  { value: "period", labelKey: "viewPeriod", icon: CalendarRange },
];

export function AnalyticsTabNav({
  tab,
  t,
  isRtl,
  onChange,
}: AnalyticsTabNavProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 rounded-[10px] border border-hairline bg-card p-[3px]",
        isRtl && "flex-row-reverse",
      )}
      role="tablist"
      aria-label={t.analytics.overviewTitle}
    >
      {tabs.map(({ value, labelKey, icon: Icon }) => {
        const active = tab === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-[11px]",
              isRtl && "flex-row-reverse",
              active
                ? "bg-brand-700 text-white"
                : "text-muted-slate hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{t.analytics[labelKey]}</span>
          </button>
        );
      })}
    </div>
  );
}
