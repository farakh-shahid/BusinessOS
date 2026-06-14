"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import type {
  DashboardDueWeekChart,
  DashboardWeekDayKey,
} from "@business-os/tailor";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";

interface DashboardDueWeekChartProps {
  chart: DashboardDueWeekChart;
  title: string;
  t: Dictionary;
  isRtl?: boolean;
}

const CHART_HEIGHT = 118;

function dayLabel(key: DashboardWeekDayKey, t: Dictionary): string {
  return t.dashboard.dueWeekChart.weekDays[key];
}

function fullDayLabel(key: DashboardWeekDayKey, t: Dictionary): string {
  return t.dashboard.dueWeekChart.weekDaysFull[key];
}

export function DashboardDueWeekChartPanel({
  chart,
  title,
  t,
  isRtl = false,
}: DashboardDueWeekChartProps) {
  const maxCount = Math.max(...chart.days.map((day) => day.count), 1);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-hairline bg-card shadow-sm">
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-4 sm:px-[17px]",
          isRtl && "flex-row-reverse",
        )}
      >
        <h2 className="font-display text-sm font-bold text-foreground">
          {title}
        </h2>
        <Link
          href={routes.ordersWithFilter("due_this_week")}
          className={cn(
            "inline-flex shrink-0 items-center gap-0.5 text-[11.5px] font-semibold text-accent-500 transition hover:text-accent-600",
            isRtl && "flex-row-reverse",
          )}
        >
          {t.dashboard.dueWeekChart.calendar}
          <ChevronRight
            className={cn("h-3.5 w-3.5", isRtl && "rotate-180")}
            strokeWidth={2.5}
          />
        </Link>
      </div>

      <div className="px-4 pb-3 sm:px-[17px]">
        <div
          className={cn(
            "flex items-end gap-1.5",
            isRtl && "flex-row-reverse",
          )}
          style={{ height: CHART_HEIGHT }}
        >
          {chart.days.map((day) => {
            const barHeight =
              day.count > 0
                ? Math.max(Math.round((day.count / maxCount) * 100), 4)
                : 4;
            const isToday = day.isToday;

            return (
              <div
                key={day.key}
                className={cn(
                  "flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5",
                )}
              >
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className={cn(
                      "relative w-full rounded-t-md transition-all",
                      isToday ? "bg-accent-500" : "bg-accent-500/20",
                    )}
                    style={{ height: `${barHeight}%` }}
                  >
                    <span
                      className={cn(
                        "absolute -top-[17px] left-0 right-0 text-center font-display text-xs font-bold tabular-nums",
                        isToday ? "text-accent-600" : "text-foreground",
                      )}
                    >
                      {day.count}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[9.5px] font-semibold",
                    isToday ? "text-accent-600" : "text-muted-slate",
                  )}
                >
                  {dayLabel(day.key, t)}
                </span>
              </div>
            );
          })}
        </div>

        {chart.heaviestCount > 0 ? (
          <p
            className={cn(
              "mt-3.5 text-[11.5px] text-muted-slate",
              isRtl && "text-right",
            )}
          >
            🔥{" "}
            <strong className="font-semibold text-foreground">
              {fullDayLabel(chart.heaviestDay, t)}
            </strong>{" "}
            {t.dashboard.dueWeekChart.heaviestDay.replace(
              "{count}",
              String(chart.heaviestCount),
            )}
          </p>
        ) : null}
      </div>
    </section>
  );
}
