export type MeasurementValues = Record<string, number | undefined>;

export type StyleValues = Record<string, string | undefined>;

/** @deprecated use MeasurementValues — kept for backward compatibility */
export interface MeasurementFields {
  chest?: number;
  waist?: number;
  shoulder?: number;
  sleeve?: number;
  neck?: number;
  shirtLength?: number;
  trouserLength?: number;
  hip?: number;
  thigh?: number;
  [key: string]: number | undefined;
}

export type PocketOption = "none" | "single" | "double";
export type CollarOption = "ban" | "round" | "spread" | "other";
export type PlacketOption = "regular" | "hidden" | "other";

/** @deprecated use StyleValues */
export interface StyleSpecs {
  chestPocket?: PocketOption;
  sidePockets?: PocketOption;
  collar?: CollarOption;
  placket?: PlacketOption;
  gera?: string;
  notes?: string;
  [key: string]: string | undefined;
}

export interface TailorMeasurement {
  id: string;
  customerId: string;
  garmentType?: string;
  measurements: MeasurementValues;
  style: StyleValues;
  createdAt: string;
}
