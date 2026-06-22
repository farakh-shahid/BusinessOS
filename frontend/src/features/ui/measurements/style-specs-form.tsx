"use client";

import type { Dictionary } from "@/i18n";
import {
  getGarmentSchema,
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@shared";
import { cn } from "@/core/presentation/lib/utils";
import { Label } from "@/core/presentation/components/ui/label";
import { Input } from "@/core/presentation/components/ui/input";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { useLocale } from "@/core/i18n/locale-context";
import {
  WorksheetField,
  WorksheetSectionTitle,
  worksheetFieldClass,
  worksheetInputClass,
  worksheetTextareaClass,
} from "@/features/ui/orders/worksheet-form-primitives";

interface StyleSpecsFormProps {
  t: Dictionary;
  garmentType: BookingGarmentType;
  style: Record<string, string>;
  onChange: (style: Record<string, string>) => void;
  variant?: "default" | "worksheet";
}

export function StyleSpecsForm({
  t,
  garmentType,
  style,
  onChange,
  variant = "default",
}: StyleSpecsFormProps) {
  const { locale } = useLocale();
  const isRtl = locale === "ur";
  const isWorksheet = variant === "worksheet";
  const schema = getGarmentSchema(normalizeBookingGarmentType(garmentType));

  if (schema.styleFields.length === 0) return null;

  function updateField(key: string, value: string) {
    onChange({ ...style, [key]: value });
  }

  function labelFor(key: string, fallback: string) {
    const styleDict = t.style as Record<string, string>;
    const formDict = t.form as Record<string, string>;
    return styleDict[key] ?? formDict[key] ?? fallback;
  }

  function optionLabel(labelKey: string) {
    const styleDict = t.style as Record<string, string>;
    return styleDict[labelKey] ?? labelKey;
  }

  const fields = schema.styleFields.map((field) => {
    if (field.type === "select" && field.options) {
      const options = field.options.map((opt) => ({
        value: opt.value,
        label: optionLabel(opt.labelKey),
      }));
      const label = labelFor(field.labelKey, field.key);

      if (isWorksheet) {
        return (
          <WorksheetField
            key={field.key}
            label={label}
            htmlFor={`style-${field.key}`}
          >
            <SearchableCombobox
              id={`style-${field.key}`}
              value={style[field.key] ?? ""}
              onChange={(value) => updateField(field.key, value)}
              options={options}
              placeholder={t.form.selectOption}
              emptyMessage={t.form.noOptions}
              isRtl={isRtl}
              searchMinOptions={8}
              aria-label={label}
              buttonClassName={cn(
                worksheetInputClass,
                "justify-between font-normal text-slate-900",
              )}
            />
          </WorksheetField>
        );
      }

      return (
        <div key={field.key}>
          <Label htmlFor={`style-${field.key}`}>{label}</Label>
          <SearchableCombobox
            id={`style-${field.key}`}
            value={style[field.key] ?? ""}
            onChange={(value) => updateField(field.key, value)}
            options={options}
            placeholder={t.form.selectOption}
            emptyMessage={t.form.noOptions}
            isRtl={isRtl}
            searchMinOptions={8}
            aria-label={label}
          />
        </div>
      );
    }

    if (field.key === "notes") {
      const label = labelFor(field.labelKey, field.key);

      if (isWorksheet) {
        return (
          <div key={field.key} className="sm:col-span-2">
            <WorksheetField label={label} htmlFor={`style-${field.key}`}>
              <Textarea
                id={`style-${field.key}`}
                value={style[field.key] ?? ""}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={t.form.styleNotesPlaceholder}
                className={worksheetTextareaClass}
              />
            </WorksheetField>
          </div>
        );
      }

      return (
        <div key={field.key} className="sm:col-span-2">
          <Label htmlFor={`style-${field.key}`}>{label}</Label>
          <Textarea
            id={`style-${field.key}`}
            value={style[field.key] ?? ""}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={t.form.styleNotesPlaceholder}
          />
        </div>
      );
    }

    const label = labelFor(field.labelKey, field.key);

    if (isWorksheet) {
      return (
        <div key={field.key} className="sm:col-span-2">
          <WorksheetField label={label} htmlFor={`style-${field.key}`}>
            <Input
              id={`style-${field.key}`}
              value={style[field.key] ?? ""}
              onChange={(e) => updateField(field.key, e.target.value)}
              className={worksheetFieldClass()}
            />
          </WorksheetField>
        </div>
      );
    }

    return (
      <div key={field.key} className="sm:col-span-2">
        <Label htmlFor={`style-${field.key}`}>{label}</Label>
        <Input
          id={`style-${field.key}`}
          value={style[field.key] ?? ""}
          onChange={(e) => updateField(field.key, e.target.value)}
        />
      </div>
    );
  });

  if (isWorksheet) {
    return (
      <section className="space-y-4">
        <WorksheetSectionTitle>{t.form.styleSpecs}</WorksheetSectionTitle>
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {fields}
        </div>
      </section>
    );
  }

  return (
    <Card>
      <CardTitle>{t.form.styleSpecs}</CardTitle>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">{fields}</div>
    </Card>
  );
}
