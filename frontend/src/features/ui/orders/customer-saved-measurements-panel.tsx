"use client";

import { Trash2 } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { CustomerDetail } from "@shared";
import {
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@shared";
import { cn } from "@/core/presentation/lib/utils";
import {
  buildMeasurementFieldStatus,
  findSavedMeasurement,
  listSavedGarmentTypes,
} from "@/features/infrastructure/data/customer-measurement-patch";
import {
  SavedMeasurementsChart,
  savedMeasurementsStatusMessage,
} from "@/features/ui/measurements/saved-measurements-chart";
import { WorksheetSectionTitle } from "@/features/ui/orders/worksheet-form-primitives";

interface CustomerSavedMeasurementsPanelProps {
  detail: CustomerDetail;
  garmentType: BookingGarmentType;
  measurements: Record<string, string>;
  t: Dictionary;
  isRtl: boolean;
  onClear: () => void;
  onSelectGarment?: (garmentType: BookingGarmentType) => void;
}

export function CustomerSavedMeasurementsPanel({
  detail,
  garmentType,
  measurements,
  t,
  isRtl,
  onClear,
  onSelectGarment,
}: CustomerSavedMeasurementsPanelProps) {
  const suitType = normalizeBookingGarmentType(garmentType);
  const saved = findSavedMeasurement(detail, suitType);
  const fieldStatus = buildMeasurementFieldStatus(suitType, measurements);
  const filledCount = fieldStatus.filter((field) => field.filled).length;
  const otherGarments = listSavedGarmentTypes(detail).filter(
    (type) => type !== suitType,
  );

  const statusMessage = savedMeasurementsStatusMessage(
    t,
    filledCount,
    fieldStatus.length,
    !!saved,
  );

  return (
    <section className="space-y-3">
      <div
        className={cn(
          "flex flex-wrap items-start justify-between gap-3",
          isRtl && "flex-row-reverse",
        )}
      >
        <div className={cn("min-w-0", isRtl && "text-right")}>
          <WorksheetSectionTitle>
            {t.form.savedMeasurementsTitle}
          </WorksheetSectionTitle>
          <p className="mt-1 text-sm text-muted-slate">
            {(t.garments as Record<string, string>)[suitType]} · {statusMessage}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-hairline bg-white px-3 py-2 text-xs font-semibold text-muted-slate transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700",
            isRtl && "flex-row-reverse",
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t.form.clearMeasurements}
        </button>
      </div>

      {otherGarments.length > 0 ? (
        <div
          className={cn(
            "flex flex-wrap gap-2",
            isRtl && "flex-row-reverse justify-end",
          )}
        >
          <span className="text-xs font-medium text-muted-slate">
            {t.form.savedOnFile}:
          </span>
          {otherGarments.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onSelectGarment?.(type)}
              className="rounded-full border border-accent-200 bg-accent-50 px-2.5 py-0.5 text-[11px] font-semibold text-accent-600 transition hover:bg-accent-100"
            >
              {(t.garments as Record<string, string>)[type]}
            </button>
          ))}
        </div>
      ) : null}

      <SavedMeasurementsChart
        garmentType={suitType}
        measurements={measurements}
        t={t}
      />
    </section>
  );
}
