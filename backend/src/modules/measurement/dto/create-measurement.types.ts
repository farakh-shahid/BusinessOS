export interface CreateMeasurementInput {
  customerId: string;
  garmentType?: string;
  measurements: Record<string, string>;
  style: Record<string, string>;
}
