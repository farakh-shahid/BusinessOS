import type { TailorCustomer } from "@business-os/tailor";
import { isValidPakistanPhone } from "@business-os/shared";
import {
  getGarmentSchema,
  normalizeBookingGarmentType,
} from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { findInvalidMeasurement } from "@/core/presentation/lib/validate-measurements";
import { findCustomerByPhone } from "@/tailor/infrastructure/data/customer-phone";
import type { NewOrderDraft } from "@/tailor/infrastructure/data/new-order.mock";

export type NewOrderFieldErrors = Record<string, string>;

export interface NewOrderValidationResult {
  valid: boolean;
  summary: string | null;
  fields: NewOrderFieldErrors;
  firstFieldId?: string;
}

function labelForMeasurementKey(
  key: string,
  t: Dictionary,
  garmentType: string,
): string {
  const schema = getGarmentSchema(normalizeBookingGarmentType(garmentType));
  const field = schema.measurementFields.find((f) => f.key === key);
  if (field) {
    return (
      (t.measurements as Record<string, string>)[field.labelKey] ?? field.labelKey
    );
  }
  return key in t.measurements
    ? t.measurements[key as keyof typeof t.measurements]
    : key;
}

export function validateNewOrderDraft(
  draft: NewOrderDraft,
  t: Dictionary,
  existingCustomers: TailorCustomer[] = [],
): NewOrderValidationResult {
  const fields: NewOrderFieldErrors = {};
  let firstFieldId: string | undefined;

  function add(fieldKey: string, domId: string, message: string) {
    if (!fields[fieldKey]) {
      fields[fieldKey] = message;
      firstFieldId ??= domId;
    }
  }

  if (draft.customerMode === "existing") {
    if (!draft.customerId) {
      add("customerId", "customer-select", t.validation.customerRequired);
    }
  } else {
    const name = draft.customerName.trim();
    if (!name || name.length < 2) {
      add("customerName", "customer-name", t.validation.nameRequired);
    }

    const phone = draft.customerPhone.trim();
    if (!phone) {
      add("customerPhone", "customer-phone", t.validation.phoneRequired);
    } else if (!isValidPakistanPhone(phone)) {
      add("customerPhone", "customer-phone", t.validation.phoneInvalid);
    } else if (findCustomerByPhone(existingCustomers, phone)) {
      add("customerPhone", "customer-phone", t.errors.phoneAlreadyExists);
    }

    const email = draft.customerEmail.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      add("customerEmail", "customer-email", t.validation.emailInvalid);
    }
  }

  if (!draft.bookingDate.trim()) {
    add("bookingDate", "booking-date", t.validation.bookingDateRequired);
  }

  if (!draft.deliveryDate.trim()) {
    add("deliveryDate", "delivery", t.validation.deliveryDateRequired);
  }

  if (!draft.totalPrice.trim()) {
    add("totalPrice", "total", t.validation.totalPriceRequired);
  }

  const suitCount = Number.parseInt(draft.suitCount, 10);
  if (!Number.isFinite(suitCount) || suitCount < 1) {
    add("suitCount", "suit-count", t.validation.suitCountInvalid);
  }

  const schema = getGarmentSchema(normalizeBookingGarmentType(draft.garmentType));
  const hasAny = Object.values(draft.measurements).some((v) => v.trim() !== "");

  if (!hasAny) {
    add("measurements", "m-neck", t.validation.measurementsRequired);
  } else {
    for (const field of schema.measurementFields) {
      if (!field.required) continue;
      if (!draft.measurements[field.key]?.trim()) {
        const label = labelForMeasurementKey(field.key, t, draft.garmentType);
        add(
          field.key,
          `m-${field.key}`,
          t.validation.measurementFieldRequired.replace("{field}", label),
        );
      }
    }

    const invalidKey = findInvalidMeasurement(draft.measurements);
    if (invalidKey) {
      const label = labelForMeasurementKey(invalidKey, t, draft.garmentType);
      add(
        invalidKey,
        `m-${invalidKey}`,
        t.errors.measurementFieldInvalid.replace("{field}", label),
      );
    }
  }

  const fieldKeys = Object.keys(fields);
  if (fieldKeys.length === 0) {
    return { valid: true, summary: null, fields: {} };
  }

  const summary =
    fieldKeys.length === 1
      ? fields[fieldKeys[0]!]
      : t.validation.fixFormErrors;

  return {
    valid: false,
    summary,
    fields,
    firstFieldId,
  };
}

/** @deprecated Prefer validateNewOrderDraft for field-level errors */
export function getNewOrderValidationError(
  draft: NewOrderDraft,
  t: Dictionary,
): string | null {
  return validateNewOrderDraft(draft, t).summary;
}
