"use client";

import type { ReactNode } from "react";
import { cn } from "@/core/presentation/lib/utils";
import { FormFieldError } from "@/core/presentation/components/ui/form-field-error";

export const worksheetInputClass =
  "h-9 min-h-9 w-full rounded-none border-0 border-b border-slate-300 bg-transparent px-0 py-1 text-base shadow-none ring-0 focus-visible:border-accent-500 focus-visible:ring-0 sm:text-sm";

export const worksheetTextareaClass =
  "min-h-[72px] w-full resize-y rounded-none border-0 border-b border-slate-300 bg-transparent px-0 py-1 text-base shadow-none ring-0 focus-visible:border-accent-500 focus-visible:ring-0 sm:text-sm";

export const worksheetInputErrorClass =
  "border-rose-400 focus-visible:border-rose-500";

export const worksheetLabelClass =
  "mb-1 block text-sm font-bold text-slate-900";

export const worksheetMeasureLabelClass =
  "mb-1 block text-[11px] font-semibold leading-snug text-brand-700 sm:text-xs";

export const measurementSectionTitleClass =
  "mb-3 text-xs font-bold uppercase tracking-wide text-brand-700";

export function WorksheetPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function WorksheetSectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-xs font-bold uppercase tracking-[0.14em] text-accent-500",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function WorksheetField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  measureStyle,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  measureStyle?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={measureStyle ? worksheetMeasureLabelClass : worksheetLabelClass}
      >
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
      {error ? <FormFieldError message={error} /> : null}
    </div>
  );
}

export function worksheetFieldClass(hasError?: boolean) {
  return cn(worksheetInputClass, hasError && worksheetInputErrorClass);
}

/** Dotted orange frame for saved / worksheet measurement charts */
export const savedMeasurementsChartBorderClass =
  "rounded-xl border-2 border-dashed border-accent-500 bg-white p-4 sm:p-5";

/** Full orange wash panel — edit measurements, saved profile blocks */
export const editMeasurementsPanelClass =
  "rounded-xl border-2 border-dashed border-accent-500 bg-accent-50 p-4 sm:p-5";
