"use client";

import type { Dictionary } from "@business-os/i18n";
import {
  getGarmentSchema,
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@business-os/tailor";
import { Label } from "@/core/presentation/components/ui/label";
import { Input } from "@/core/presentation/components/ui/input";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { FormFieldError } from "@/core/presentation/components/ui/form-field-error";
import { sanitizeMeasurementInput } from "@/core/presentation/lib/validate-measurements";
import type { NewOrderFieldErrors } from "@/tailor/infrastructure/data/new-order-validation";
import { useLocale } from "@/core/i18n/locale-context";

interface MeasurementFieldsFormProps {
  t: Dictionary;
  garmentType: BookingGarmentType;
  measurements: Record<string, string>;
  onChange: (measurements: Record<string, string>) => void;
  fieldErrors?: NewOrderFieldErrors;
}

const groupLabels: Record<string, keyof Dictionary["form"]> = {
  body: "measurementGroupBody",
  upper: "measurementGroupUpper",
  lower: "measurementGroupLower",
};

export function MeasurementFieldsForm({
  t,
  garmentType,
  measurements,
  onChange,
  fieldErrors = {},
}: MeasurementFieldsFormProps) {
  const { locale } = useLocale();
  const suitType = normalizeBookingGarmentType(garmentType);
  const schema = getGarmentSchema(suitType);
  const groups = ["body", "upper", "lower"] as const;

  function updateField(key: string, value: string, isNumeric: boolean) {
    const next = isNumeric ? sanitizeMeasurementInput(value) : value;
    onChange({ ...measurements, [key]: next });
  }

  function labelFor(key: string) {
    const m = t.measurements as Record<string, string>;
    return m[key] ?? key;
  }

  return (
    <Card>
      <CardTitle>{t.form.measurements}</CardTitle>
      <p className="mt-1 text-sm text-slate-500">
        {t.garments[suitType]} · {t.form.unitInches}
      </p>
      <p className="mt-0.5 text-xs text-slate-400">{t.form.unitInchesHint}</p>
      {fieldErrors.measurements ? (
        <FormFieldError message={fieldErrors.measurements} />
      ) : null}

      <div className="mt-4 space-y-5">
        {groups.map((group) => {
          const fields = schema.measurementFields.filter(
            (f) => (f.group ?? "body") === group,
          );
          if (fields.length === 0) return null;

          return (
            <section key={group}>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                {t.form[groupLabels[group]]}
              </h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {fields.map((field) => {
                  const isNumeric = field.type !== "text";

                  return (
                    <div key={field.key}>
                      <Label htmlFor={`m-${field.key}`}>
                        {labelFor(field.labelKey)}
                        {isNumeric ? ` (${t.form.inchesAbbr})` : ""}
                        {field.required ? " *" : ""}
                      </Label>
                      <Input
                        id={`m-${field.key}`}
                        type="text"
                        inputMode={isNumeric ? "decimal" : "text"}
                        placeholder={
                          isNumeric ? t.form.measurementPlaceholder : ""
                        }
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
            </section>
          );
        })}
      </div>
    </Card>
  );
}
