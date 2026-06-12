"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type { DailyAnalyticsPoint, TailorAnalytics } from "@business-os/tailor";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { toDateInputValue } from "./analytics-date-utils";

interface AnalyticsCalendarPickerProps {
  data: TailorAnalytics;
  selectedDay: string;
  onSelectDay: (date: string) => void;
  onJumpToDate: (date: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: "week" | "month") => void;
}

export function AnalyticsCalendarPicker({
  data,
  selectedDay,
  onSelectDay,
  onJumpToDate,
  onPrevious,
  onNext,
  onViewChange,
}: AnalyticsCalendarPickerProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  const days: DailyAnalyticsPoint[] = data.dailyBreakdown;
  const minDate = toDateInputValue(new Date(data.tenantCreatedAt));
  const maxDate = toDateInputValue(new Date());

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-analytics-select-muted text-analytics-select transition hover:bg-analytics-select/10 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t.analytics.previousPeriod}
          >
            <ChevronLeft className={cn("h-5 w-5", isRtl && "rotate-180")} />
          </button>
          <div className={cn("min-w-[10rem] text-center", isRtl && "text-right")}>
            <p className="text-base font-bold text-slate-900">{data.rangeLabel}</p>
            <p className="text-xs text-slate-500">{t.analytics.periodReports}</p>
          </div>
          <button
            type="button"
            onClick={onNext}
            disabled={!data.canGoNext}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-analytics-select-muted text-analytics-select transition hover:bg-analytics-select/10 disabled:cursor-not-allowed disabled:opacity-40"
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
          <label
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700",
              isRtl && "flex-row-reverse",
            )}
          >
            <Calendar className="h-4 w-4 shrink-0 text-analytics-select" />
            <span className="sr-only sm:not-sr-only">{t.analytics.pickDate}</span>
            <input
              type="date"
              value={selectedDay}
              min={minDate}
              max={maxDate}
              onChange={(e) => {
                if (e.target.value) onJumpToDate(e.target.value);
              }}
              className="border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
              aria-label={t.analytics.pickDate}
            />
          </label>

          <button
            type="button"
            onClick={() => onViewChange("week")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              data.viewMode === "week"
                ? "bg-analytics-select text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            )}
          >
            {t.analytics.weekView}
          </button>
          <button
            type="button"
            onClick={() => onViewChange("month")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              data.viewMode === "month"
                ? "bg-analytics-select text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            )}
          >
            {t.analytics.monthView}
          </button>
        </div>
      </div>

      {data.viewMode === "week" && (
        <div className="mt-5 grid grid-cols-7 gap-2">
          {days.map((day) => {
            const isSelected = day.date === selectedDay;
            const isDisabled = day.disabled;

            return (
              <button
                key={day.date}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelectDay(day.date)}
                className={cn(
                  "flex flex-col items-center rounded-2xl px-1 py-3 transition",
                  isSelected && "bg-analytics-select text-white shadow-md",
                  !isSelected && !isDisabled && "bg-slate-50 text-slate-700 hover:bg-slate-100",
                  isDisabled && "cursor-not-allowed bg-transparent text-slate-300",
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
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {days.map((week, index) => {
            const next = days[index + 1];
            const weekSelected =
              !week.disabled &&
              selectedDay >= week.date &&
              (!next || selectedDay < next.date);

            return (
              <button
                key={week.date}
                type="button"
                disabled={week.disabled}
                onClick={() => onSelectDay(week.date)}
                className={cn(
                  "rounded-2xl px-3 py-3 text-center transition",
                  weekSelected && "bg-analytics-select text-white shadow-md",
                  !weekSelected &&
                    !week.disabled &&
                    "bg-slate-50 text-slate-700 hover:bg-slate-100",
                  week.disabled && "cursor-not-allowed bg-slate-50 text-slate-300",
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
