"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import type { DashboardTailorWorkloadItem } from "@business-os/tailor";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";

interface DashboardTailorWorkloadPanelProps {
  items: DashboardTailorWorkloadItem[];
  t: Dictionary;
  isRtl?: boolean;
}

const BAR_COLORS = ["#3B6FF6", "#8B5CF6", "#12A36A", "#E5484D"] as const;

function initials(name: string, isUnassigned?: boolean): string {
  if (isUnassigned) return "?";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardTailorWorkloadPanel({
  items,
  t,
  isRtl = false,
}: DashboardTailorWorkloadPanelProps) {
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-hairline bg-card shadow-sm">
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-4 sm:px-[17px]",
          isRtl && "flex-row-reverse",
        )}
      >
        <h2 className="font-display text-sm font-bold text-foreground">
          {t.dashboard.tailorWorkload.title}
        </h2>
        <Link
          href={routes.assignments}
          className={cn(
            "inline-flex shrink-0 items-center gap-0.5 text-[11.5px] font-semibold text-accent-500 transition hover:text-accent-600",
            isRtl && "flex-row-reverse",
          )}
        >
          {t.dashboard.tailorWorkload.assign}
          <ChevronRight
            className={cn("h-3.5 w-3.5", isRtl && "rotate-180")}
            strokeWidth={2.5}
          />
        </Link>
      </div>

      <div className="space-y-2.5 px-4 pb-4 sm:px-[17px]">
        {items.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-slate">
            {t.dashboard.workload.noBottleneck}
          </p>
        ) : (
          items.map((item, index) => {
            const color = BAR_COLORS[index % BAR_COLORS.length];
            const displayName = item.isUnassigned
              ? t.dashboard.tailorWorkload.unassigned
              : item.name;

            return (
              <div
                key={item.name}
                className={cn(
                  "flex items-center gap-2",
                  isRtl && "flex-row-reverse",
                )}
              >
                <div
                  className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-[9px] font-display text-[9px] font-bold text-white"
                  style={{ background: color }}
                >
                  {initials(displayName, item.isUnassigned)}
                </div>
                <span
                  className={cn(
                    "w-[70px] shrink-0 truncate text-[11.5px] font-semibold",
                    isRtl && "text-right",
                  )}
                >
                  <PersonNameText name={displayName} />
                </span>
                <div className="h-3.5 flex-1 overflow-hidden rounded-md bg-slate-100">
                  <div
                    className="h-full rounded-md transition-all"
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      background: color,
                    }}
                  />
                </div>
                <span className="w-4 shrink-0 text-right font-display text-xs font-bold tabular-nums">
                  {item.count}
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
