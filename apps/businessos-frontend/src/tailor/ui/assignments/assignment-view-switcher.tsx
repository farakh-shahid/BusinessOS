"use client";

import { LayoutGrid, Table2, Users } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import type { AssignmentView } from "@/tailor/infrastructure/data/assignment-board-utils";

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
        "inline-flex shrink-0 rounded-[10px] border border-hairline bg-card p-[3px]",
        isRtl && "flex-row-reverse",
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
              "inline-flex cursor-pointer items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-[11px]",
              isRtl && "flex-row-reverse",
              active
                ? "bg-brand-700 text-white"
                : "text-muted-slate hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">{t.assignments[labelKey]}</span>
          </button>
        );
      })}
    </div>
  );
}
