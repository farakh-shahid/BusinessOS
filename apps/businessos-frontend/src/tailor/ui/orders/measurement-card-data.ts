export {
  measurementCardDataFromOrder,
  type MeasurementCardData,
} from "@business-os/tailor";

import type { Dictionary } from "@business-os/i18n";
import type { CustomerDetail } from "@business-os/tailor";
import {
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@business-os/tailor";
import {
  findSavedMeasurement,
  measurementToDraftFields,
} from "@/tailor/infrastructure/data/customer-measurement-patch";
import { resolveGarmentStyle } from "@/tailor/infrastructure/data/style-field-display";

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
