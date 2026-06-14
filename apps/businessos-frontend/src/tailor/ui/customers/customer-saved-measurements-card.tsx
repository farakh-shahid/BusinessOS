"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import type { CustomerDetail } from "@business-os/tailor";
import {
  emptyMeasurementsForGarment,
  type BookingGarmentType,
} from "@business-os/tailor";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import {
  buildMeasurementFieldStatus,
  findSavedMeasurement,
  listSavedGarmentTypes,
  measurementToDraftFields,
} from "@/tailor/infrastructure/data/customer-measurement-patch";
import { bookingGarmentOptions } from "@/tailor/infrastructure/data/new-order.mock";
import { resolveGarmentStyle } from "@/tailor/infrastructure/data/style-field-display";
import {
  SavedMeasurementsChart,
  savedMeasurementsStatusMessage,
} from "@/tailor/ui/measurements/saved-measurements-chart";
import { SavedStylePreferencesChart } from "@/tailor/ui/measurements/saved-style-preferences-chart";
import {
  WorksheetField,
  worksheetInputClass,
} from "@/tailor/ui/orders/worksheet-form-primitives";
import { MeasurementCardDialog } from "@/tailor/ui/orders/measurement-card-dialog";
import { measurementCardDataFromCustomer } from "@/tailor/ui/orders/measurement-card-data";
import { Button } from "@/core/presentation/components/ui/button";

interface CustomerSavedMeasurementsCardProps {
  data: CustomerDetail;
  t: Dictionary;
  isRtl: boolean;
}

export function CustomerSavedMeasurementsCard({
  data,
  t,
  isRtl,
}: CustomerSavedMeasurementsCardProps) {
  const savedTypes = listSavedGarmentTypes(data);
  const [garmentType, setGarmentType] =
    useState<BookingGarmentType>("shalwarQameez");
  const [cardOpen, setCardOpen] = useState(false);

  const saved = findSavedMeasurement(
    { ...data, savedMeasurements: data.savedMeasurements ?? [] },
    garmentType,
  );
  const measurements = saved
    ? measurementToDraftFields(saved, garmentType).measurements
    : emptyMeasurementsForGarment(garmentType);

  const fieldStatus = buildMeasurementFieldStatus(garmentType, measurements);
  const filledCount = fieldStatus.filter((field) => field.filled).length;
  const statusMessage = savedMeasurementsStatusMessage(
    t,
    filledCount,
    fieldStatus.length,
    !!saved,
  );

  const styleProfile = resolveGarmentStyle(data, garmentType);
  const styleSourceHint =
    styleProfile.source === "order" && styleProfile.orderNumber
      ? t.customers.lastOrderStyleFrom
          .replace("{order}", styleProfile.orderNumber)
          .replace("{date}", styleProfile.orderDate ?? "")
      : styleProfile.source === "saved"
        ? t.customers.savedStyleOnFile
        : null;

  const dropdownOptions = bookingGarmentOptions.map(({ value, labelKey }) => ({
    value,
    label: t.garments[labelKey],
  }));

  const measurementCardData = useMemo(
    () => measurementCardDataFromCustomer(data, garmentType, t),
    [data, garmentType, t],
  );

  return (
    <>
    <Card className="border-hairline">
      <div
        className={cn(
          "flex flex-wrap items-start justify-between gap-3",
          isRtl && "flex-row-reverse",
        )}
      >
        <CardTitle>{t.customers.savedMeasurements}</CardTitle>
        <Button
          type="button"
          variant="outline"
          className="gap-1.5 text-sm"
          onClick={() => setCardOpen(true)}
        >
          <Eye className="h-4 w-4" />
          {t.receipt.viewMeasurementCard}
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        <WorksheetField
          label={t.form.suitType}
          htmlFor="customer-saved-garment"
        >
          <SearchableCombobox
            id="customer-saved-garment"
            value={garmentType}
            onChange={(next) => setGarmentType(next as BookingGarmentType)}
            options={dropdownOptions}
            placeholder={t.form.selectGarment}
            isRtl={isRtl}
            searchMinOptions={1}
            aria-label={t.form.suitType}
            buttonClassName={cn(
              worksheetInputClass,
              "justify-between font-normal text-slate-900",
            )}
          />
        </WorksheetField>

        {savedTypes.length > 0 ? (
          <div
            className={cn(
              "flex flex-wrap items-center gap-1.5",
              isRtl && "flex-row-reverse",
            )}
          >
            <span className="text-[10px] font-medium text-muted-slate">
              {t.form.savedOnFile}:
            </span>
            {savedTypes.map((type) => {
              const active = garmentType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setGarmentType(type)}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold transition",
                    active
                      ? "border-brand-700 bg-brand-700 text-white"
                      : "border-accent-200 bg-accent-50 text-accent-600 hover:bg-accent-100",
                  )}
                >
                  {(t.garments as Record<string, string>)[type]}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-slate">{t.customers.noMeasurements}</p>
        )}

        <p className={cn("text-sm text-muted-slate", isRtl && "text-right")}>
          {(t.garments as Record<string, string>)[garmentType]} · {statusMessage}
        </p>

        <SavedMeasurementsChart
          garmentType={garmentType}
          measurements={measurements}
          t={t}
        />

        <div className="border-t border-hairline pt-4">
          <h3
            className={cn(
              "font-display text-sm font-bold text-foreground",
              isRtl && "text-right",
            )}
          >
            {t.customers.lastOrderStyle}
          </h3>
          {styleSourceHint ? (
            <p
              className={cn(
                "mt-1 text-xs text-muted-slate",
                isRtl && "text-right",
              )}
            >
              {styleSourceHint}
            </p>
          ) : null}
          <div className="mt-3">
            <SavedStylePreferencesChart
              garmentType={garmentType}
              style={styleProfile.style}
              t={t}
            />
          </div>
        </div>

        {savedTypes.length === 0 ? (
          <Link
            href={routes.customerEdit(data.customer.id)}
            className={cn(
              "inline-block text-sm font-semibold text-brand-700 hover:underline",
              isRtl && "block text-right",
            )}
          >
            {t.customers.addMeasurementsLink}
          </Link>
        ) : null}
      </div>
    </Card>
    <MeasurementCardDialog
      data={cardOpen ? measurementCardData : null}
      onClose={() => setCardOpen(false)}
    />
    </>
  );
}
