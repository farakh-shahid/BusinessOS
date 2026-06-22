import type { Dictionary } from "@/i18n";
import type {
  CustomerDetail,
  CustomerGarmentStyleProfile,
} from "@shared";
import {
  getGarmentSchema,
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@shared";
import {
  findSavedMeasurement,
  measurementToDraftFields,
} from "./customer-measurement-patch";

export interface StyleFieldDisplay {
  key: string;
  labelKey: string;
  displayValue: string;
}

export function findLastOrderStyle(
  detail: CustomerDetail,
  garmentType: BookingGarmentType | string,
): CustomerGarmentStyleProfile | null {
  const suitType = normalizeBookingGarmentType(garmentType);
  return (
    detail.lastOrderStyles?.find(
      (profile) =>
        normalizeBookingGarmentType(profile.garmentType) === suitType,
    ) ?? null
  );
}

export function resolveGarmentStyle(
  detail: CustomerDetail,
  garmentType: BookingGarmentType | string,
): {
  style: Record<string, string>;
  source: "order" | "saved" | "none";
  orderNumber?: string;
  orderDate?: string;
} {
  const fromOrder = findLastOrderStyle(detail, garmentType);
  if (fromOrder) {
    return {
      style: styleRecordFromValues(fromOrder.style),
      source: "order",
      orderNumber: fromOrder.orderNumber,
      orderDate: fromOrder.orderDate,
    };
  }

  const saved = findSavedMeasurement(detail, garmentType);
  if (saved) {
    const { style } = measurementToDraftFields(saved, garmentType);
    if (hasStyleContent(style)) {
      return { style, source: "saved" };
    }
  }

  return { style: {}, source: "none" };
}

function styleRecordFromValues(
  style: Record<string, string | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(style)) {
    if (value?.trim()) out[key] = value.trim();
  }
  return out;
}

export function hasStyleContent(style: Record<string, string>): boolean {
  return Object.values(style).some((value) => value.trim().length > 0);
}

export function buildStyleFieldDisplay(
  garmentType: BookingGarmentType | string,
  style: Record<string, string>,
  t: Dictionary,
): StyleFieldDisplay[] {
  const suitType = normalizeBookingGarmentType(garmentType);
  const schema = getGarmentSchema(suitType);
  const styleDict = t.style as Record<string, string>;
  const formDict = t.form as Record<string, string>;

  return schema.styleFields
    .map((field) => {
      const raw = style[field.key]?.trim() ?? "";
      if (!raw) return null;

      let displayValue = raw;
      if (field.type === "select" && field.options) {
        const option = field.options.find((opt) => opt.value === raw);
        if (option) {
          displayValue = styleDict[option.labelKey] ?? option.labelKey;
        }
      }

      return {
        key: field.key,
        labelKey: field.labelKey,
        displayValue,
      };
    })
    .filter((field): field is StyleFieldDisplay => field !== null);
}

export function styleFieldLabel(
  labelKey: string,
  t: Dictionary,
): string {
  const styleDict = t.style as Record<string, string>;
  const formDict = t.form as Record<string, string>;
  return styleDict[labelKey] ?? formDict[labelKey] ?? labelKey;
}
