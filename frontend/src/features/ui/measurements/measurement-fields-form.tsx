"use client";

import type { Dictionary } from "@/i18n";
import {
  getGarmentSchema,
  getWorksheetMeasurementFields,
  normalizeBookingGarmentType,
  type BookingGarmentType,
  type MeasurementFieldDef,
} from "@shared";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";
import { Label } from "@/core/presentation/components/ui/label";
import { Input } from "@/core/presentation/components/ui/input";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { FormFieldError } from "@/core/presentation/components/ui/form-field-error";
import { sanitizeMeasurementInput } from "@/core/presentation/lib/validate-measurements";
import type { NewOrderFieldErrors } from "@/features/infrastructure/data/new-order-validation";
import { useLocale } from "@/core/i18n/locale-context";
import {
  WorksheetField,
  WorksheetSectionTitle,
  measurementSectionTitleClass,
  savedMeasurementsChartBorderClass,
  worksheetFieldClass,
  worksheetMeasureLabelClass,
} from "@/features/ui/orders/worksheet-form-primitives";

interface MeasurementFieldsFormProps {
  t: Dictionary;
  garmentType: BookingGarmentType;
  measurements: Record<string, string>;
  onChange: (measurements: Record<string, string>) => void;
  fieldErrors?: NewOrderFieldErrors;
  variant?: "default" | "worksheet";
  framed?: boolean;
  showWorksheetHeader?: boolean;
}

const groupLabels: Record<string, keyof Dictionary["form"]> = {
  size: "measurementGroupSize",
  main: "measurementGroupMain",
};

const MEASUREMENT_GROUPS = ["size", "main"] as const;

const MEASUREMENT_STEP = 0.5;
const MEASUREMENT_MIN = 0;
const MEASUREMENT_MAX = 999.99;

function formatStepValue(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return String(rounded);
}

interface MeasurementStepperFieldProps {
  label: string;
  unit: string;
  value: string;
  required?: boolean;
  error?: string;
  htmlFor: string;
  dir?: "ltr";
  placeholder?: string;
  onChange: (value: string) => void;
}

function MeasurementStepperField({
  label,
  unit,
  value,
  required,
  error,
  htmlFor,
  dir,
  placeholder,
  onChange,
}: MeasurementStepperFieldProps) {
  const parsed = Number.parseFloat(value);
  const current = Number.isFinite(parsed) ? parsed : 0;

  function step(delta: number) {
    const next = Math.min(
      MEASUREMENT_MAX,
      Math.max(MEASUREMENT_MIN, current + delta),
    );
    onChange(formatStepValue(next));
  }

  const stepperButtonClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors active:bg-slate-100 disabled:opacity-40";

  return (
    <div className="border-b border-slate-200 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="min-w-0 flex-1 text-sm font-semibold text-slate-900"
        >
          {label}
          {required ? <span className="text-rose-500"> *</span> : null}
        </label>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            aria-label={`${label} −`}
            className={stepperButtonClass}
            onClick={() => step(-MEASUREMENT_STEP)}
            disabled={current <= MEASUREMENT_MIN}
          >
            <Minus className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <div
            className={cn(
              "flex h-10 w-[5.25rem] items-center rounded-lg border bg-white px-2 transition-colors focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500/15",
              error ? "border-rose-400" : "border-slate-300",
            )}
          >
            <input
              id={htmlFor}
              type="text"
              inputMode="decimal"
              placeholder={placeholder}
              value={value}
              aria-invalid={!!error}
              className="w-full min-w-0 border-0 bg-transparent p-0 text-center text-base font-bold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-300 focus:ring-0"
              onChange={(e) => onChange(e.target.value)}
              dir={dir}
              autoComplete="off"
            />
            <span className="shrink-0 pl-1 text-xs font-medium text-slate-400">
              {unit}
            </span>
          </div>

          <button
            type="button"
            aria-label={`${label} +`}
            className={stepperButtonClass}
            onClick={() => step(MEASUREMENT_STEP)}
            disabled={current >= MEASUREMENT_MAX}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      {error ? <FormFieldError message={error} /> : null}
    </div>
  );
}

export function MeasurementFieldsForm({
  t,
  garmentType,
  measurements,
  onChange,
  fieldErrors = {},
  variant = "default",
  framed = true,
  showWorksheetHeader = true,
}: MeasurementFieldsFormProps) {
  const { locale } = useLocale();
  const isWorksheet = variant === "worksheet";
  const suitType = normalizeBookingGarmentType(garmentType);
  const schema = getGarmentSchema(suitType);
  const requiredKeys = new Set(
    schema.measurementFields.filter((field) => field.required).map((f) => f.key),
  );

  const allFields: MeasurementFieldDef[] = getWorksheetMeasurementFields();

  function updateField(key: string, value: string, isNumeric: boolean) {
    const next = isNumeric ? sanitizeMeasurementInput(value) : value;
    onChange({ ...measurements, [key]: next });
  }

  function labelFor(key: string) {
    const m = t.measurements as Record<string, string>;
    return m[key] ?? key;
  }

  function renderStepperList(fields: MeasurementFieldDef[]) {
    return (
      <div className="sm:hidden">
        {fields.map((field) => {
          const isNumeric = field.type !== "text";
          const label = labelFor(field.labelKey);

          if (!isNumeric) {
            return (
              <WorksheetField
                key={field.key}
                label={label}
                htmlFor={`m-${field.key}-m`}
                required={requiredKeys.has(field.key)}
                error={fieldErrors[field.key]}
                measureStyle
              >
                <Input
                  id={`m-${field.key}-m`}
                  type="text"
                  value={measurements[field.key] ?? ""}
                  aria-invalid={!!fieldErrors[field.key]}
                  className={worksheetFieldClass(!!fieldErrors[field.key])}
                  onChange={(e) =>
                    updateField(field.key, e.target.value, false)
                  }
                  dir={locale === "ur" ? "ltr" : undefined}
                  autoComplete="off"
                />
              </WorksheetField>
            );
          }

          return (
            <MeasurementStepperField
              key={field.key}
              htmlFor={`m-${field.key}-m`}
              label={label}
              unit={t.form.inchesAbbr}
              value={measurements[field.key] ?? ""}
              required={requiredKeys.has(field.key)}
              error={fieldErrors[field.key]}
              placeholder={t.form.measurementPlaceholder}
              dir={locale === "ur" ? "ltr" : undefined}
              onChange={(value) => updateField(field.key, value, true)}
            />
          );
        })}
      </div>
    );
  }

  function renderFieldGrid(fields: MeasurementFieldDef[], worksheetLayout: boolean) {
    return (
      <div
        className={cn(
          "gap-x-4 gap-y-5",
          worksheetLayout
            ? "hidden sm:grid sm:grid-cols-3 md:grid-cols-4"
            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
        )}
      >
        {fields.map((field) => {
          const isNumeric = field.type !== "text";
          const label = labelFor(field.labelKey);

          if (worksheetLayout) {
            return (
              <WorksheetField
                key={field.key}
                label={label}
                htmlFor={`m-${field.key}`}
                required={requiredKeys.has(field.key)}
                error={fieldErrors[field.key]}
                measureStyle
              >
                <Input
                  id={`m-${field.key}`}
                  type="text"
                  inputMode={isNumeric ? "decimal" : "text"}
                  placeholder={isNumeric ? t.form.measurementPlaceholder : ""}
                  value={measurements[field.key] ?? ""}
                  aria-invalid={!!fieldErrors[field.key]}
                  className={worksheetFieldClass(!!fieldErrors[field.key])}
                  onChange={(e) =>
                    updateField(field.key, e.target.value, isNumeric)
                  }
                  dir={locale === "ur" ? "ltr" : undefined}
                  autoComplete="off"
                />
              </WorksheetField>
            );
          }

          return (
            <div key={field.key}>
              <Label
                htmlFor={`m-${field.key}`}
                className={worksheetMeasureLabelClass}
              >
                {label}
                {isNumeric ? ` (${t.form.inchesAbbr})` : ""}
                {requiredKeys.has(field.key) ? " *" : ""}
              </Label>
              <Input
                id={`m-${field.key}`}
                type="text"
                inputMode={isNumeric ? "decimal" : "text"}
                placeholder={isNumeric ? t.form.measurementPlaceholder : ""}
                value={measurements[field.key] ?? ""}
                aria-invalid={!!fieldErrors[field.key]}
                className={
                  fieldErrors[field.key]
                    ? "border-rose-300 focus-visible:ring-rose-400"
                    : undefined
                }
                onChange={(e) =>
                  updateField(field.key, e.target.value, isNumeric)
                }
                dir={locale === "ur" ? "ltr" : undefined}
                autoComplete="off"
              />
              <FormFieldError message={fieldErrors[field.key]} />
            </div>
          );
        })}
      </div>
    );
  }

  if (isWorksheet) {
    const sections = MEASUREMENT_GROUPS.map((group) => ({
      group,
      fields: allFields.filter((field) => (field.group ?? "main") === group),
    })).filter((section) => section.fields.length > 0);

    const body = (
      <div className="space-y-6">
        {sections.map(({ group, fields }) => (
          <section key={group}>
            <h3 className={measurementSectionTitleClass}>
              {t.form[groupLabels[group]]}
            </h3>
            {renderStepperList(fields)}
            {renderFieldGrid(fields, true)}
          </section>
        ))}
      </div>
    );

    return (
      <section className="space-y-4">
        {showWorksheetHeader ? (
          <>
            <WorksheetSectionTitle>
              {t.form.measurementsWorksheetTitle}
            </WorksheetSectionTitle>
            <p className="text-xs text-slate-400">{t.form.unitInchesHint}</p>
          </>
        ) : null}
        {fieldErrors.measurements ? (
          <FormFieldError message={fieldErrors.measurements} />
        ) : null}
        {framed ? (
          <div className={savedMeasurementsChartBorderClass}>{body}</div>
        ) : (
          body
        )}
      </section>
    );
  }

  return (
    <Card>
      <CardTitle>{t.form.measurements}</CardTitle>
      <p className="mt-1 text-sm font-medium text-brand-700">
        {t.garments[suitType]} · {t.form.unitInches}
      </p>
      <p className="mt-0.5 text-xs text-slate-400">{t.form.unitInchesHint}</p>
      {fieldErrors.measurements ? (
        <FormFieldError message={fieldErrors.measurements} />
      ) : null}

      <div className="mt-4 space-y-5">
        {MEASUREMENT_GROUPS.map((group) => {
          const fields = allFields.filter(
            (field) => (field.group ?? "main") === group,
          );
          if (fields.length === 0) return null;

          return (
            <section key={group}>
              <h3 className={measurementSectionTitleClass}>
                {t.form[groupLabels[group]]}
              </h3>
              {renderFieldGrid(fields, false)}
            </section>
          );
        })}
      </div>
    </Card>
  );
}
