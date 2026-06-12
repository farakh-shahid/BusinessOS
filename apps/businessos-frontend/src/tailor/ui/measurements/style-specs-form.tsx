"use client";

import type { Dictionary } from "@business-os/i18n";
import {
  getGarmentSchema,
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@business-os/tailor";
import { Label } from "@/core/presentation/components/ui/label";
import { Input } from "@/core/presentation/components/ui/input";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { useLocale } from "@/core/i18n/locale-context";

interface StyleSpecsFormProps {
  t: Dictionary;
  garmentType: BookingGarmentType;
  style: Record<string, string>;
  onChange: (style: Record<string, string>) => void;
}

export function StyleSpecsForm({
  t,
  garmentType,
  style,
  onChange,
}: StyleSpecsFormProps) {
  const { locale } = useLocale();
  const isRtl = locale === "ur";
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

  return (
    <Card>
      <CardTitle>{t.form.styleSpecs}</CardTitle>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {schema.styleFields.map((field) => {
          if (field.type === "select" && field.options) {
            const options = field.options.map((opt) => ({
              value: opt.value,
              label: optionLabel(opt.labelKey),
            }));

            return (
              <div key={field.key}>
                <Label htmlFor={`style-${field.key}`}>
                  {labelFor(field.labelKey, field.key)}
                </Label>
                <SearchableCombobox
                  id={`style-${field.key}`}
                  value={style[field.key] ?? ""}
                  onChange={(value) => updateField(field.key, value)}
                  options={options}
                  placeholder={t.form.selectOption}
                  emptyMessage={t.form.noOptions}
                  isRtl={isRtl}
                  searchMinOptions={8}
                  aria-label={labelFor(field.labelKey, field.key)}
                />
              </div>
            );
          }

          if (field.key === "notes") {
            return (
              <div key={field.key} className="sm:col-span-2">
                <Label htmlFor={`style-${field.key}`}>
                  {labelFor(field.labelKey, field.key)}
                </Label>
                <Textarea
                  id={`style-${field.key}`}
                  value={style[field.key] ?? ""}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={t.form.styleNotesPlaceholder}
                />
              </div>
            );
          }

          return (
            <div key={field.key} className="sm:col-span-2">
              <Label htmlFor={`style-${field.key}`}>
                {labelFor(field.labelKey, field.key)}
              </Label>
              <Input
                id={`style-${field.key}`}
                value={style[field.key] ?? ""}
                onChange={(e) => updateField(field.key, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
