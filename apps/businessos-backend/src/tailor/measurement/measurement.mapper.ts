import type { TailorMeasurement } from "@business-os/tailor";
import type {
  CollarType,
  GarmentType,
  PlacketType,
  PocketOption,
} from "../../generated/prisma/client";
import {
  decimalToNumber,
  fromCollarType,
  fromGarmentType,
  fromPlacketType,
  fromPocketOption,
} from "../common/tailor.mapper";
import {
  normalizeMeasurementMap,
  normalizeStyleMap,
} from "./measurement-json.helper";

type MeasurementRow = {
  id: string;
  customerId: string;
  garmentType: GarmentType | null;
  measurementsData: unknown;
  styleData: unknown;
  chest: { toString(): string } | number | null;
  waist: { toString(): string } | number | null;
  shoulder: { toString(): string } | number | null;
  sleeve: { toString(): string } | number | null;
  neck: { toString(): string } | number | null;
  shirtLength: { toString(): string } | number | null;
  trouserLength: { toString(): string } | number | null;
  hip: { toString(): string } | number | null;
  thigh: { toString(): string } | number | null;
  chestPocket: PocketOption | null;
  sidePockets: PocketOption | null;
  collar: CollarType | null;
  placket: PlacketType | null;
  gera: string | null;
  notes: string | null;
  createdAt: Date;
};

function legacyMeasurements(row: MeasurementRow): Record<string, number | undefined> {
  return {
    chest: decimalToNumber(row.chest),
    waist: decimalToNumber(row.waist),
    shoulder: decimalToNumber(row.shoulder),
    sleeve: decimalToNumber(row.sleeve),
    neck: decimalToNumber(row.neck),
    shirtLength: decimalToNumber(row.shirtLength),
    trouserLength: decimalToNumber(row.trouserLength),
    hip: decimalToNumber(row.hip),
    thigh: decimalToNumber(row.thigh),
    qameezLength: decimalToNumber(row.shirtLength),
    shalwarLength: decimalToNumber(row.trouserLength),
  };
}

function legacyStyle(row: MeasurementRow): Record<string, string | undefined> {
  return {
    chestPocket: fromPocketOption(row.chestPocket) as string | undefined,
    sidePockets: fromPocketOption(row.sidePockets) as string | undefined,
    collar: fromCollarType(row.collar) as string | undefined,
    placket: fromPlacketType(row.placket) as string | undefined,
    gera: row.gera ?? undefined,
    notes: row.notes ?? undefined,
  };
}

function numericValues(
  data: Record<string, string>,
): Record<string, number | undefined> {
  const out: Record<string, number | undefined> = {};
  for (const [key, value] of Object.entries(data)) {
    const n = Number(value);
    if (Number.isFinite(n)) out[key] = n;
  }
  return out;
}

export function toMeasurementDto(row: MeasurementRow): TailorMeasurement {
  const jsonMeasurements = normalizeMeasurementMap(
    row.measurementsData as Record<string, unknown>,
  );
  const jsonStyle = normalizeStyleMap(row.styleData as Record<string, unknown>);

  const hasJsonMeasurements = Object.keys(jsonMeasurements).length > 0;
  const hasJsonStyle = Object.keys(jsonStyle).length > 0;

  const measurements = hasJsonMeasurements
    ? numericValues(jsonMeasurements)
    : legacyMeasurements(row);

  const style = hasJsonStyle
    ? jsonStyle
    : legacyStyle(row);

  return {
    id: row.id,
    customerId: row.customerId,
    garmentType: row.garmentType
      ? (fromGarmentType(row.garmentType) as TailorMeasurement["garmentType"])
      : undefined,
    measurements,
    style,
    createdAt: row.createdAt.toISOString(),
  };
}
