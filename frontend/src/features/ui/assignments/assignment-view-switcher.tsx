"use client";

import { LayoutGrid, Table2, Users } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import type { AssignmentView } from "@/features/infrastructure/data/assignment-board-utils";

interface AssignmentViewSwitcherProps {
  view: AssignmentView;
  t: Dictionary;
  isRtl?: boolean;
  onChange: (view: AssignmentView) => void;
}

const views: {
  value: AssignmentView;
  labelKey: "viewGrid" | "viewBoard" | "viewTable";
  icon: typeof LayoutGrid;
}[] = [
  { value: "grid", labelKey: "viewGrid", icon: Users },
  { value: "board", labelKey: "viewBoard", icon: LayoutGrid },
  { value: "table", labelKey: "viewTable", icon: Table2 },
];

export function AssignmentViewSwitcher({
  view,
  t,
  isRtl,
  onChange,
}: AssignmentViewSwitcherProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-3 gap-[3px] rounded-[10px] border border-hairline bg-card p-[3px] sm:inline-flex sm:w-auto",
        isRtl && "sm:flex-row-reverse",
      )}
      role="tablist"
      aria-label={t.assignments.viewBoard}
    >
      {views.map(({ value, labelKey, icon: Icon }) => {
        const active = view === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={cn(
              "flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-[7px] px-1 py-2.5 text-center transition-colors sm:flex-row sm:gap-1.5 sm:px-[11px] sm:py-1.5",
              isRtl && "sm:flex-row-reverse",
              active
                ? "bg-brand-700 text-white"
                : "text-muted-slate hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" />
            <span className="max-w-full truncate text-[10px] font-semibold leading-tight sm:text-xs">
              {t.assignments[labelKey]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
