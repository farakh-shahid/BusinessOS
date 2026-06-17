"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { DailyAnalyticsPoint, TailorAnalytics } from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import {
  parseMonthInput,
  parseWeekInput,
  toDateInputValue,
  toMonthInputValue,
  toWeekInputValue,
} from "./analytics-date-utils";

interface AnalyticsCalendarPickerProps {
  data: TailorAnalytics;
  anchor: string;
  focusedDay: string | null;
  onSelectDay: (date: string) => void;
  onJumpToPeriod: (date: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: "week" | "month") => void;
}

export function AnalyticsCalendarPicker({
  data,
  anchor,
  focusedDay,
  onSelectDay,
  onJumpToPeriod,
  onPrevious,
  onNext,
  onViewChange,
}: AnalyticsCalendarPickerProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  const days: DailyAnalyticsPoint[] = data.dailyBreakdown;
  const anchorDate = new Date(anchor);
  const minWeek = toWeekInputValue(new Date(data.tenantCreatedAt));
  const maxWeek = toWeekInputValue(new Date());
  const minMonth = toMonthInputValue(new Date(data.tenantCreatedAt));
  const maxMonth = toMonthInputValue(new Date());

  return (
    <div className="rounded-2xl border border-hairline bg-card p-4 sm:p-5">
      <div
        className={cn(
          "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
          isRtl && "lg:flex-row-reverse",
        )}
      >
        <div className={cn("flex items-center gap-2", isRtl && "flex-row-reverse")}>
          <button
            type="button"
            onClick={onPrevious}
            disabled={!data.canGoPrevious}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-background text-analytics-select transition hover:bg-analytics-select/10 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t.analytics.previousPeriod}
          >
            <ChevronLeft className={cn("h-5 w-5", isRtl && "rotate-180")} />
          </button>
          <div className={cn("min-w-[10rem] text-center", isRtl && "text-right")}>
            <p className="font-display text-base font-bold text-foreground">
              {data.rangeLabel}
            </p>
            <p className="text-xs text-muted-slate">{t.analytics.periodReports}</p>
          </div>
          <button
            type="button"
            onClick={onNext}
            disabled={!data.canGoNext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-background text-analytics-select transition hover:bg-analytics-select/10 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t.analytics.nextPeriod}
          >
            <ChevronRight className={cn("h-5 w-5", isRtl && "rotate-180")} />
          </button>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            isRtl && "flex-row-reverse",
          )}
        >
          {data.viewMode === "week" ? (
            <label
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border border-hairline bg-background px-3 py-2 text-sm font-medium text-foreground",
                isRtl && "flex-row-reverse",
              )}
            >
              <Calendar className="h-4 w-4 shrink-0 text-analytics-select" />
              <span className="hidden sm:inline">{t.analytics.pickWeek}</span>
              <input
                type="week"
                value={toWeekInputValue(anchorDate)}
                min={minWeek}
                max={maxWeek}
                onChange={(e) => {
                  if (e.target.value) onJumpToPeriod(parseWeekInput(e.target.value));
                }}
                className="border-0 bg-transparent text-sm font-semibold text-foreground outline-none"
                aria-label={t.analytics.pickWeek}
              />
            </label>
          ) : (
            <label
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border border-hairline bg-background px-3 py-2 text-sm font-medium text-foreground",
                isRtl && "flex-row-reverse",
              )}
            >
              <Calendar className="h-4 w-4 shrink-0 text-analytics-select" />
              <span className="hidden sm:inline">{t.analytics.pickMonth}</span>
              <input
                type="month"
                value={toMonthInputValue(anchorDate)}
                min={minMonth}
                max={maxMonth}
                onChange={(e) => {
                  if (e.target.value) onJumpToPeriod(parseMonthInput(e.target.value));
                }}
                className="border-0 bg-transparent text-sm font-semibold text-foreground outline-none"
                aria-label={t.analytics.pickMonth}
              />
            </label>
          )}

          <button
            type="button"
            onClick={() => onViewChange("week")}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              data.viewMode === "week"
                ? "bg-analytics-select text-white shadow-sm"
                : "border border-hairline bg-background text-muted-slate hover:text-foreground",
            )}
          >
            {t.analytics.weekView}
          </button>
          <button
            type="button"
            onClick={() => onViewChange("month")}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              data.viewMode === "month"
                ? "bg-analytics-select text-white shadow-sm"
                : "border border-hairline bg-background text-muted-slate hover:text-foreground",
            )}
          >
            {t.analytics.monthView}
          </button>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-muted-slate">
        {focusedDay ? t.analytics.drillDownHint : t.analytics.rangeHint}
      </p>

      {data.viewMode === "week" && (
        <div className="mt-4 grid grid-cols-7 gap-2">
          {days.map((day) => {
            const isSelected = focusedDay === day.date;
            const isDisabled = day.disabled;

            return (
              <button
                key={day.date}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelectDay(day.date)}
                className={cn(
                  "flex flex-col items-center rounded-xl px-1 py-3 transition",
                  isSelected && "bg-analytics-select text-white shadow-md",
                  !isSelected && !isDisabled && "bg-background text-foreground hover:bg-background/80",
                  isDisabled && "cursor-not-allowed bg-transparent text-muted-slate/50",
                )}
              >
                <span className="text-[11px] font-medium uppercase">{day.dayLabel}</span>
                <span className="mt-1 text-lg font-bold">{day.dateLabel}</span>
                {!isDisabled && day.orders > 0 && (
                  <span
                    className={cn(
                      "mt-1 text-[10px] font-semibold",
                      isSelected ? "text-white/80" : "text-analytics-select",
                    )}
                  >
                    {day.orders}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {data.viewMode === "month" && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {days.map((week, index) => {
            const next = days[index + 1];
            const weekSelected =
              focusedDay !== null &&
              !week.disabled &&
              focusedDay >= week.date &&
              (!next || focusedDay < next.date);

            return (
              <button
                key={week.date}
                type="button"
                disabled={week.disabled}
                onClick={() => onSelectDay(week.date)}
                className={cn(
                  "rounded-xl px-3 py-3 text-center transition",
                  weekSelected && "bg-analytics-select text-white shadow-md",
                  !weekSelected &&
                    !week.disabled &&
                    "bg-background text-foreground hover:bg-background/80",
                  week.disabled && "cursor-not-allowed bg-background text-muted-slate/50",
                )}
              >
                <p className="text-xs font-semibold uppercase">{week.dayLabel}</p>
                <p className="mt-1 text-sm font-bold">{week.dateLabel}</p>
                {!week.disabled && (
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      weekSelected ? "text-white/80" : "text-analytics-select",
                    )}
                  >
                    {week.orders} {t.analytics.orders.toLowerCase()}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
