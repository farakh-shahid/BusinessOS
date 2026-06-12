import { BadRequestException } from "@nestjs/common";
import { parseDecimal } from "../common/tailor.mapper";

const MEASUREMENT_MIN = 0;
const MEASUREMENT_MAX = 999.99;

/** Parse inches for legacy decimal columns — rejects out-of-range values with a clear message. */
export function parseMeasurementInches(
  value: string | undefined,
  fieldLabel = "Measurement",
): number | undefined {
  if (!value?.trim()) return undefined;

  const parsed = parseDecimal(value.trim());
  if (parsed === undefined) {
    throw new BadRequestException(
      `${fieldLabel} must be a number in inches (e.g. 34.5).`,
    );
  }

  if (parsed < MEASUREMENT_MIN || parsed > MEASUREMENT_MAX) {
    throw new BadRequestException(
      `${fieldLabel} must be between ${MEASUREMENT_MIN} and 999 inches (e.g. 34.5). You entered ${parsed}.`,
    );
  }

  return Math.round(parsed * 100) / 100;
}

export type MeasurementMap = Record<string, string | undefined>;
export type StyleMap = Record<string, string | undefined>;

function pick(
  data: MeasurementMap,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = data[key];
    if (value?.trim()) return value.trim();
  }
  return undefined;
}

/** Mirror common keys into legacy decimal columns for reports and compatibility. */
export function legacyMeasurementColumns(data: MeasurementMap) {
  return {
    chest: parseMeasurementInches(pick(data, "chest"), "Chest"),
    waist: parseMeasurementInches(pick(data, "waist"), "Waist"),
    shoulder: parseMeasurementInches(pick(data, "shoulder"), "Shoulder"),
    sleeve: parseMeasurementInches(pick(data, "sleeve"), "Sleeve"),
    neck: parseMeasurementInches(pick(data, "neck"), "Neck"),
    shirtLength: parseMeasurementInches(
      pick(
        data,
        "qameezLength",
        "kurtaLength",
        "sherwaniLength",
        "coatLength",
        "waistcoatLength",
        "shirtLength",
      ),
      "Length",
    ),
    trouserLength: parseMeasurementInches(
      pick(data, "shalwarLength", "trouserLength", "pajamaLength", "inseam"),
      "Trouser / shalwar length",
    ),
    hip: parseMeasurementInches(pick(data, "hip"), "Hip"),
    thigh: parseMeasurementInches(pick(data, "thigh"), "Thigh"),
  };
}

export function normalizeMeasurementMap(
  input: Record<string, unknown> | undefined,
): Record<string, string> {
  if (!input) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === "") continue;
    out[key] = String(value);
  }
  return out;
}

export function normalizeStyleMap(
  input: Record<string, unknown> | undefined,
): Record<string, string> {
  return normalizeMeasurementMap(input);
}

export function styleFromFlatDto(dto: {
  chestPocket?: string;
  sidePockets?: string;
  collar?: string;
  placket?: string;
  gera?: string;
  styleNotes?: string;
  style?: Record<string, unknown>;
}): StyleMap {
  if (dto.style && Object.keys(dto.style).length > 0) {
    return normalizeStyleMap(dto.style);
  }
  return normalizeStyleMap({
    chestPocket: dto.chestPocket,
    sidePockets: dto.sidePockets,
    collar: dto.collar,
    placket: dto.placket,
    gera: dto.gera,
    notes: dto.styleNotes,
  });
}
