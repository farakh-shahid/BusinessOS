import type { CustomerDetail } from "@business-os/tailor";
import {
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

/** Fills measurements + style from customer history when garment type matches. */
export function patchFromCustomerDetail(
  detail: CustomerDetail,
  garmentType: BookingGarmentType | string,
): Partial<NewOrderDraft> {
  const suitType = normalizeBookingGarmentType(garmentType);
  const m = detail.latestMeasurement;

  if (!m) {
    return {
      measurements: emptyMeasurementsForGarment(suitType),
      style: emptyStyleForGarment(suitType),
    };
  }

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

  const savedGarment = normalizeBookingGarmentType(m.garmentType);

  return {
    measurements: baseMeasurements,
    style: baseStyle,
    garmentType: savedGarment === suitType ? suitType : undefined,
  };
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
