import { isValidPakistanPhone } from "@business-os/shared";
import {
  getGarmentSchema,
  normalizeBookingGarmentType,
} from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { findInvalidMeasurement } from "@/core/presentation/lib/validate-measurements";
import type { NewOrderDraft } from "@/tailor/infrastructure/data/new-order.mock";

export function getNewOrderValidationError(
  draft: NewOrderDraft,
  t: Dictionary,
): string | null {
  if (draft.customerMode === "existing" && !draft.customerId) {
    return t.validation.customerRequired;
  }

  if (draft.customerMode === "new") {
    const name = draft.customerName.trim();
    if (!name || name.length < 2) {
      return t.validation.nameRequired;
    }

    const phone = draft.customerPhone.trim();
    if (!phone) {
      return t.validation.phoneRequired;
    }
    if (!isValidPakistanPhone(phone)) {
      return t.validation.phoneInvalid;
    }

    const email = draft.customerEmail.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return t.validation.emailInvalid;
    }
  }

  if (!draft.bookingDate || !draft.deliveryDate || !draft.totalPrice.trim()) {
    return t.validation.orderDetailsRequired;
  }

  const suitCount = Number.parseInt(draft.suitCount, 10);
  if (!Number.isFinite(suitCount) || suitCount < 1) {
    return t.validation.suitCountInvalid;
  }

  const schema = getGarmentSchema(normalizeBookingGarmentType(draft.garmentType));
  const hasRequired = schema.measurementFields
    .filter((f) => f.required)
    .every((f) => draft.measurements[f.key]?.trim());

  const hasAny = Object.values(draft.measurements).some((v) => v.trim() !== "");

  if (!hasAny) {
    return t.validation.measurementsRequired;
  }

  if (!hasRequired) {
    return t.validation.requiredMeasurementsMissing;
  }

  const invalidKey = findInvalidMeasurement(draft.measurements);
  if (invalidKey) {
    const field = schema.measurementFields.find((f) => f.key === invalidKey);
    const label = field
      ? (t.measurements as Record<string, string>)[field.labelKey] ?? invalidKey
      : invalidKey;
    return t.errors.measurementFieldInvalid.replace("{field}", label);
  }

  return null;
}
