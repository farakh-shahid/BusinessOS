"use client";

import type { Dictionary } from "@/i18n";
import type { BookingGarmentType } from "@shared";
import { cn } from "@/core/presentation/lib/utils";
import {
  buildStyleFieldDisplay,
  styleFieldLabel,
} from "@/features/infrastructure/data/style-field-display";

interface SavedStylePreferencesChartProps {
  garmentType: BookingGarmentType;
  style: Record<string, string>;
  t: Dictionary;
  className?: string;
}

export function SavedStylePreferencesChart({
  garmentType,
  style,
  t,
  className,
}: SavedStylePreferencesChartProps) {
  const fields = buildStyleFieldDisplay(garmentType, style, t);

  if (fields.length === 0) {
    return (
      <p className={cn("text-sm text-muted-slate", className)}>
        {t.customers.noStyleOnFile}
      </p>
    );
  }

  return (
    <dl
      className={cn(
        "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {fields.map((field) => (
        <div
          key={field.key}
          className="rounded-lg border border-hairline bg-white px-3 py-2.5 shadow-sm"
        >
          <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-slate">
            {styleFieldLabel(field.labelKey, t)}
          </dt>
          <dd className="mt-0.5 text-sm font-semibold text-foreground">
            {field.displayValue}
          </dd>
        </div>
      ))}
    </dl>
  );
}
