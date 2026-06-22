"use client";

import { BarChart3, Users } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import type { AssignmentPageMode } from "@/features/infrastructure/data/assignment-board-utils";

interface AssignmentModeSwitcherProps {
  mode: AssignmentPageMode;
  t: Dictionary;
  isRtl?: boolean;
  onChange: (mode: AssignmentPageMode) => void;
}

const modes: {
  value: AssignmentPageMode;
  labelKey: "modeWorkload" | "modePerformance";
  shortLabelKey: "modeWorkloadShort" | "modePerformanceShort";
  icon: typeof Users;
}[] = [
  {
    value: "workload",
    labelKey: "modeWorkload",
    shortLabelKey: "modeWorkloadShort",
    icon: Users,
  },
  {
    value: "performance",
    labelKey: "modePerformance",
    shortLabelKey: "modePerformanceShort",
    icon: BarChart3,
  },
];

export function AssignmentModeSwitcher({
  mode,
  t,
  isRtl,
  onChange,
}: AssignmentModeSwitcherProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-2 gap-[3px] rounded-[10px] border border-hairline bg-card p-[3px] sm:inline-flex sm:w-auto",
        isRtl && "sm:flex-row-reverse",
      )}
      role="tablist"
      aria-label={t.assignments.modeWorkload}
    >
      {modes.map(({ value, labelKey, shortLabelKey, icon: Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={cn(
              "flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-[7px] px-1.5 py-2.5 text-center transition-colors sm:flex-row sm:gap-1.5 sm:px-[11px] sm:py-1.5",
              isRtl && "sm:flex-row-reverse",
              active
                ? "bg-brand-700 text-white"
                : "text-muted-slate hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" />
            <span className="max-w-full truncate text-[10px] font-semibold leading-tight sm:text-xs">
              <span className="sm:hidden">{t.assignments[shortLabelKey]}</span>
              <span className="hidden sm:inline">{t.assignments[labelKey]}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
