export {
  measurementCardDataFromOrder,
  type MeasurementCardData,
} from "@shared";

import type { Dictionary } from "@/i18n";
import type { CustomerDetail } from "@shared";
import {
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@shared";
import {
  findSavedMeasurement,
  measurementToDraftFields,
} from "@/features/infrastructure/data/customer-measurement-patch";
import { resolveGarmentStyle } from "@/features/infrastructure/data/style-field-display";

export function measurementCardDataFromCustomer(
  data: CustomerDetail,
  garmentType: BookingGarmentType,
  t: Dictionary,
) {
  const saved = findSavedMeasurement(
    { ...data, savedMeasurements: data.savedMeasurements ?? [] },
    garmentType,
  );
  const draft = saved
    ? measurementToDraftFields(saved, garmentType)
    : { measurements: {}, style: {} };
  const styleProfile = resolveGarmentStyle(data, garmentType);
  const garmentLabel =
    (t.garments as Record<string, string>)[garmentType] ?? garmentType;
  const matchingOrder = data.orders.find(
    (order) => normalizeBookingGarmentType(order.garmentType) === garmentType,
  );

  return {
    customerName: data.customer.name,
    customerPhone: data.customer.phone,
    garmentLabel,
    garmentType,
    measurements: draft.measurements,
    style: {
      ...styleProfile.style,
      ...draft.style,
    },
    orderId: matchingOrder?.id,
    orderNumber: matchingOrder?.orderNumber,
  };
}
