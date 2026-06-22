import type { BookingGarmentType, TailorMeasurement } from "@shared";
import { apiFetch } from "@/core/infrastructure/api/api-client";

export interface MeasurementPayload {
  garmentType?: BookingGarmentType;
  measurements: Record<string, string>;
  style: Record<string, string>;
}

export function createMeasurement(
  customerId: string,
  payload: MeasurementPayload,
) {
  return apiFetch<TailorMeasurement>("/tailor/measurements", {
    method: "POST",
    body: JSON.stringify({
      customerId,
      garmentType: payload.garmentType,
      measurements: payload.measurements,
      style: payload.style,
    }),
  });
}

export function updateMeasurement(
  measurementId: string,
  payload: MeasurementPayload,
) {
  return apiFetch<TailorMeasurement>(`/tailor/measurements/${measurementId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
