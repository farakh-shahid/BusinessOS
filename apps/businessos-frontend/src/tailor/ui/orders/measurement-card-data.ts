import type { Dictionary } from "@business-os/i18n";
import type { CustomerDetail, OrderFullDetail } from "@business-os/tailor";
import {
  normalizeBookingGarmentType,
  type BookingGarmentType,
} from "@business-os/tailor";
import {
  findSavedMeasurement,
  measurementToDraftFields,
} from "@/tailor/infrastructure/data/customer-measurement-patch";
import { resolveGarmentStyle } from "@/tailor/infrastructure/data/style-field-display";

export interface MeasurementCardData {
  customerName: string;
  customerPhone: string;
  garmentLabel: string;
  garmentType: string;
  suitNo?: string | number;
  measurements: Record<string, string | number | undefined>;
  style?: Record<string, string | undefined>;
  orderId?: string;
  orderNumber?: string;
}

export function measurementCardDataFromOrder(
  order: OrderFullDetail,
): MeasurementCardData {
  return {
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    garmentLabel: order.garmentLabel,
    garmentType: order.garmentType,
    suitNo: order.suitCount,
    measurements: order.measurements,
    style: order.style,
    orderId: order.id,
    orderNumber: order.orderNumber,
  };
}

export function measurementCardDataFromCustomer(
  data: CustomerDetail,
  garmentType: BookingGarmentType,
  t: Dictionary,
): MeasurementCardData {
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
