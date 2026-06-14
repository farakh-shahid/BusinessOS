import type { CustomerDetail, TailorMeasurement } from "@business-os/tailor";
import {
  bookingGarmentTypes,
  emptyMeasurementsForGarment,
  emptyStyleForGarment,
  getGarmentSchema,
  normalizeBookingGarmentType,
  sharedMeasurementKeys,
  type BookingGarmentType,
} from "@business-os/tailor";
import type { NewOrderDraft } from "./new-order.mock";

function numberToField(value?: number): string {
  return value !== undefined && value !== null ? String(value) : "";
}

export function findSavedMeasurement(
  detail: CustomerDetail,
  garmentType: BookingGarmentType | string,
): TailorMeasurement | null {
  const suitType = normalizeBookingGarmentType(garmentType);
  const saved = detail.savedMeasurements?.find(
    (m) =>
      m.garmentType &&
      normalizeBookingGarmentType(m.garmentType) === suitType,
  );
  if (saved) return saved;

  const latest = detail.latestMeasurement;
  if (
    latest?.garmentType &&
    normalizeBookingGarmentType(latest.garmentType) === suitType
  ) {
    return latest;
  }

  return null;
}

export function measurementToDraftFields(
  m: TailorMeasurement,
  garmentType: BookingGarmentType | string,
): { measurements: Record<string, string>; style: Record<string, string> } {
  const suitType = normalizeBookingGarmentType(garmentType);
  const baseMeasurements = emptyMeasurementsForGarment(suitType);
  const schema = getGarmentSchema(suitType);

  for (const field of schema.measurementFields) {
    const fromJson = m.measurements[field.key];
    if (fromJson !== undefined && fromJson !== null) {
      baseMeasurements[field.key] = String(fromJson);
    }
  }

  for (const key of sharedMeasurementKeys) {
    if (!baseMeasurements[key]?.trim() && m.measurements[key] !== undefined) {
      baseMeasurements[key] = numberToField(m.measurements[key]);
    }
  }

  const baseStyle = emptyStyleForGarment(suitType);
  for (const field of schema.styleFields) {
    const value = m.style[field.key];
    if (value) baseStyle[field.key] = value;
  }

  return { measurements: baseMeasurements, style: baseStyle };
}

export interface MeasurementFieldStatus {
  key: string;
  labelKey: string;
  value: string;
  filled: boolean;
  required: boolean;
}

export function buildMeasurementFieldStatus(
  garmentType: BookingGarmentType | string,
  measurements: Record<string, string>,
): MeasurementFieldStatus[] {
  const suitType = normalizeBookingGarmentType(garmentType);
  const schema = getGarmentSchema(suitType);

  return schema.measurementFields.map((field) => {
    const value = measurements[field.key]?.trim() ?? "";
    return {
      key: field.key,
      labelKey: field.labelKey,
      value,
      filled: value.length > 0,
      required: field.required ?? false,
    };
  });
}

export function listSavedGarmentTypes(detail: CustomerDetail): BookingGarmentType[] {
  const types = new Set<BookingGarmentType>();

  for (const m of detail.savedMeasurements ?? []) {
    if (m.garmentType) {
      types.add(normalizeBookingGarmentType(m.garmentType));
    }
  }

  if (
    detail.latestMeasurement?.garmentType &&
    !types.has(normalizeBookingGarmentType(detail.latestMeasurement.garmentType))
  ) {
    types.add(normalizeBookingGarmentType(detail.latestMeasurement.garmentType));
  }

  return bookingGarmentTypes.filter((type) => types.has(type));
}

/** Fills measurements + style from customer saved profile for the selected garment. */
export function patchFromCustomerDetail(
  detail: CustomerDetail,
  garmentType: BookingGarmentType | string,
): Partial<NewOrderDraft> {
  const suitType = normalizeBookingGarmentType(garmentType);
  const saved = findSavedMeasurement(detail, suitType);

  if (!saved) {
    return {
      measurements: emptyMeasurementsForGarment(suitType),
      style: emptyStyleForGarment(suitType),
    };
  }

  return measurementToDraftFields(saved, suitType);
}

/** Clears dress/order-specific fields when switching customers. */
export function resetDressFieldsForNewOrder(
  garmentType?: string | null,
): Partial<NewOrderDraft> {
  const suitType = normalizeBookingGarmentType(garmentType);
  return {
    garmentType: suitType,
    measurements: emptyMeasurementsForGarment(suitType),
    style: emptyStyleForGarment(suitType),
    dressCode: "",
    suitCount: "1",
    dressImageUrl: "",
    bookingDate: new Date().toISOString().slice(0, 10),
    deliveryDate: "",
    advancePaid: "",
    totalPrice: "",
    fabricNotes: "",
  };
}
