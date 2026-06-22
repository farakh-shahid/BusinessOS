"use client";

import {
  Crown,
  Layers,
  Shirt,
  Sparkles,
  Square,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { BookingGarmentType } from "@shared";
import { cn } from "@/core/presentation/lib/utils";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { bookingGarmentOptions } from "@/features/infrastructure/data/new-order.mock";
import {
  WorksheetField,
  worksheetInputClass,
} from "@/features/ui/orders/worksheet-form-primitives";

const garmentIcons: Record<BookingGarmentType, LucideIcon> = {
  shalwarQameez: Shirt,
  dressPantCoat: Layers,
  sherwani: Crown,
  kurta: Sparkles,
  waistcoat: Square,
};

const garmentTone: Record<BookingGarmentType, string> = {
  shalwarQameez: "border-brand-200 bg-brand-50 text-brand-800",
  dressPantCoat: "border-indigo-200 bg-indigo-50 text-indigo-800",
  sherwani: "border-amber-200 bg-amber-50 text-amber-900",
  kurta: "border-emerald-200 bg-emerald-50 text-emerald-800",
  waistcoat: "border-violet-200 bg-violet-50 text-violet-800",
};

const garmentToneActive: Record<BookingGarmentType, string> = {
  shalwarQameez: "border-brand-700 bg-brand-700 text-white shadow-md shadow-brand-700/20",
  dressPantCoat: "border-indigo-700 bg-indigo-700 text-white shadow-md shadow-indigo-700/20",
  sherwani: "border-amber-600 bg-amber-600 text-white shadow-md shadow-amber-600/20",
  kurta: "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
  waistcoat: "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/20",
};

interface GarmentTypeSectionProps {
  t: Dictionary;
  value: BookingGarmentType;
  onChange: (garmentType: BookingGarmentType) => void;
  isRtl: boolean;
  variant?: "default" | "worksheet";
}

export function GarmentTypeSection({
  t,
  value,
  onChange,
  isRtl,
  variant = "default",
}: GarmentTypeSectionProps) {
  const options = bookingGarmentOptions.map(({ value: garmentValue, labelKey }) => ({
    value: garmentValue,
    label: t.garments[labelKey],
  }));

  if (variant === "worksheet") {
    return (
      <WorksheetField label={t.form.suitType} htmlFor="garment-type">
        <SearchableCombobox
          id="garment-type"
          value={value}
          onChange={(next) => onChange(next as BookingGarmentType)}
          options={options}
          placeholder={t.form.suitType}
          isRtl={isRtl}
          searchMinOptions={1}
          aria-label={t.form.suitType}
          buttonClassName={cn(
            worksheetInputClass,
            "justify-between font-normal text-slate-900",
          )}
        />
      </WorksheetField>
    );
  }

  return (
    <Card>
      <CardTitle>{t.form.suitType}</CardTitle>
      <p className="mt-1 text-sm text-slate-500">{t.form.suitTypeHint}</p>
      <div
        className={cn(
          "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5",
          isRtl && "text-right",
        )}
      >
        {bookingGarmentOptions.map(({ value: garmentValue, labelKey }) => {
          const Icon = garmentIcons[garmentValue];
          const active = value === garmentValue;
          return (
            <button
              key={garmentValue}
              type="button"
              onClick={() => onChange(garmentValue)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition active:scale-[0.98]",
                active ? garmentToneActive[garmentValue] : garmentTone[garmentValue],
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  active ? "bg-white/20" : "bg-white/80",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="text-xs font-bold leading-tight">
                {t.garments[labelKey]}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
