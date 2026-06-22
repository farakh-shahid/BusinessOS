"use client";

import type { Dictionary } from "@/i18n";
import {
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@shared";
import { cn } from "@/core/presentation/lib/utils";
import { buildMeasurementFieldStatus } from "@/features/infrastructure/data/customer-measurement-patch";

interface SavedMeasurementsChartProps {
  garmentType: BookingGarmentType;
  measurements: Record<string, string>;
  t: Dictionary;
  className?: string;
}

export function SavedMeasurementsChart({
  garmentType,
  measurements,
  t,
  className,
}: SavedMeasurementsChartProps) {
  const suitType = normalizeBookingGarmentType(garmentType);
  const fieldStatus = buildMeasurementFieldStatus(suitType, measurements);

  function labelFor(key: string) {
    const m = t.measurements as Record<string, string>;
    return m[key] ?? key;
  }

  return (
    <div className={cn("rounded-xl p-1 sm:p-2", className)}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {fieldStatus.map((field) => (
          <div
            key={field.key}
            className={cn(
              "rounded-lg border border-hairline px-2.5 py-2 text-center transition-colors",
              field.filled
                ? "bg-white shadow-sm"
                : "bg-slate-50/80",
            )}
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-slate">
              {labelFor(field.labelKey)}
              {field.required ? (
                <span className="text-rose-400"> *</span>
              ) : null}
            </p>
            <p
              className={cn(
                "mt-0.5 font-display text-sm font-bold tabular-nums",
                field.filled ? "text-foreground" : "text-slate-300",
              )}
              dir="ltr"
            >
              {field.filled ? `${field.value}"` : "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function savedMeasurementsStatusMessage(
  t: Dictionary,
  filledCount: number,
  totalCount: number,
  hasSaved: boolean,
): string {
  if (!hasSaved) return t.form.savedMeasurementsNone;
  if (filledCount === totalCount) return t.form.savedMeasurementsComplete;
  return t.form.savedMeasurementsPartial
    .replace("{filled}", String(filledCount))
    .replace("{total}", String(totalCount));
}
