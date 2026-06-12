/** Garment types available when booking a new order */
export type BookingGarmentType =
  | "shalwarQameez"
  | "dressPantCoat"
  | "sherwani"
  | "kurta"
  | "waistcoat";

export const bookingGarmentTypes: BookingGarmentType[] = [
  "shalwarQameez",
  "dressPantCoat",
  "sherwani",
  "kurta",
  "waistcoat",
];

export type MeasurementFieldType = "number" | "text";

export interface MeasurementFieldDef {
  key: string;
  labelKey: string;
  type?: MeasurementFieldType;
  required?: boolean;
  group?: "body" | "upper" | "lower";
}

export interface StyleFieldDef {
  key: string;
  labelKey: string;
  type: "select" | "text";
  options?: Array<{ value: string; labelKey: string }>;
}

export interface GarmentMeasurementSchema {
  garmentType: BookingGarmentType;
  measurementFields: MeasurementFieldDef[];
  styleFields: StyleFieldDef[];
}

/** Pakistani tailor-style measurement charts per garment (inches). */
export const garmentMeasurementSchemas: Record<
  BookingGarmentType,
  GarmentMeasurementSchema
> = {
  shalwarQameez: {
    garmentType: "shalwarQameez",
    measurementFields: [
      { key: "neck", labelKey: "neck", group: "body", required: true },
      { key: "shoulder", labelKey: "shoulder", group: "body", required: true },
      { key: "chest", labelKey: "chest", group: "body", required: true },
      { key: "waist", labelKey: "waist", group: "body", required: true },
      { key: "hip", labelKey: "hip", group: "body" },
      { key: "sleeve", labelKey: "sleeve", group: "upper", required: true },
      { key: "qameezLength", labelKey: "qameezLength", group: "upper", required: true },
      { key: "shalwarLength", labelKey: "shalwarLength", group: "lower", required: true },
      { key: "thigh", labelKey: "thigh", group: "lower" },
      { key: "armhole", labelKey: "armhole", group: "upper" },
      { key: "bicep", labelKey: "bicep", group: "upper" },
      { key: "wrist", labelKey: "wrist", group: "upper" },
    ],
    styleFields: [
      {
        key: "collar",
        labelKey: "collar",
        type: "select",
        options: [
          { value: "regular", labelKey: "collarRegular" },
          { value: "ban", labelKey: "collarBan" },
          { value: "spread", labelKey: "collarSpread" },
          { value: "other", labelKey: "collarOther" },
        ],
      },
      {
        key: "placket",
        labelKey: "placket",
        type: "select",
        options: [
          { value: "regular", labelKey: "placketRegular" },
          { value: "hidden", labelKey: "placketHidden" },
          { value: "other", labelKey: "placketOther" },
        ],
      },
      {
        key: "chestPocket",
        labelKey: "chestPocket",
        type: "select",
        options: [
          { value: "none", labelKey: "none" },
          { value: "single", labelKey: "single" },
          { value: "double", labelKey: "double" },
        ],
      },
      {
        key: "sidePockets",
        labelKey: "sidePockets",
        type: "select",
        options: [
          { value: "none", labelKey: "none" },
          { value: "single", labelKey: "single" },
          { value: "double", labelKey: "double" },
        ],
      },
      { key: "gera", labelKey: "gera", type: "text" },
      { key: "notes", labelKey: "styleNotes", type: "text" },
    ],
  },
  dressPantCoat: {
    garmentType: "dressPantCoat",
    measurementFields: [
      { key: "neck", labelKey: "neck", group: "body", required: true },
      { key: "shoulder", labelKey: "shoulder", group: "body", required: true },
      { key: "chest", labelKey: "chest", group: "body", required: true },
      { key: "waist", labelKey: "waist", group: "body", required: true },
      { key: "hip", labelKey: "hip", group: "body", required: true },
      { key: "sleeve", labelKey: "sleeve", group: "upper", required: true },
      { key: "coatLength", labelKey: "coatLength", group: "upper", required: true },
      { key: "trouserLength", labelKey: "trouserLength", group: "lower", required: true },
      { key: "inseam", labelKey: "inseam", group: "lower" },
      { key: "thigh", labelKey: "thigh", group: "lower" },
      { key: "knee", labelKey: "knee", group: "lower" },
      { key: "crotch", labelKey: "crotch", group: "lower" },
    ],
    styleFields: [
      {
        key: "lapel",
        labelKey: "lapel",
        type: "select",
        options: [
          { value: "notch", labelKey: "lapelNotch" },
          { value: "peak", labelKey: "lapelPeak" },
          { value: "shawl", labelKey: "lapelShawl" },
        ],
      },
      {
        key: "vent",
        labelKey: "vent",
        type: "select",
        options: [
          { value: "single", labelKey: "ventSingle" },
          { value: "double", labelKey: "ventDouble" },
          { value: "none", labelKey: "ventNone" },
        ],
      },
      { key: "notes", labelKey: "styleNotes", type: "text" },
    ],
  },
  sherwani: {
    garmentType: "sherwani",
    measurementFields: [
      { key: "neck", labelKey: "neck", group: "body", required: true },
      { key: "shoulder", labelKey: "shoulder", group: "body", required: true },
      { key: "chest", labelKey: "chest", group: "body", required: true },
      { key: "stomach", labelKey: "stomach", group: "body" },
      { key: "waist", labelKey: "waist", group: "body", required: true },
      { key: "hip", labelKey: "hip", group: "body" },
      { key: "sleeve", labelKey: "sleeve", group: "upper", required: true },
      { key: "sherwaniLength", labelKey: "sherwaniLength", group: "upper", required: true },
      { key: "trouserLength", labelKey: "trouserLength", group: "lower" },
      { key: "thigh", labelKey: "thigh", group: "lower" },
    ],
    styleFields: [
      {
        key: "collar",
        labelKey: "collar",
        type: "select",
        options: [
          { value: "ban", labelKey: "collarBan" },
          { value: "regular", labelKey: "collarRegular" },
          { value: "other", labelKey: "collarOther" },
        ],
      },
      { key: "notes", labelKey: "styleNotes", type: "text" },
    ],
  },
  kurta: {
    garmentType: "kurta",
    measurementFields: [
      { key: "neck", labelKey: "neck", group: "body", required: true },
      { key: "shoulder", labelKey: "shoulder", group: "body", required: true },
      { key: "chest", labelKey: "chest", group: "body", required: true },
      { key: "waist", labelKey: "waist", group: "body", required: true },
      { key: "hip", labelKey: "hip", group: "body" },
      { key: "sleeve", labelKey: "sleeve", group: "upper", required: true },
      { key: "kurtaLength", labelKey: "kurtaLength", group: "upper", required: true },
      { key: "pajamaLength", labelKey: "pajamaLength", group: "lower" },
      { key: "thigh", labelKey: "thigh", group: "lower" },
    ],
    styleFields: [
      {
        key: "collar",
        labelKey: "collar",
        type: "select",
        options: [
          { value: "regular", labelKey: "collarRegular" },
          { value: "ban", labelKey: "collarBan" },
          { value: "other", labelKey: "collarOther" },
        ],
      },
      {
        key: "placket",
        labelKey: "placket",
        type: "select",
        options: [
          { value: "regular", labelKey: "placketRegular" },
          { value: "hidden", labelKey: "placketHidden" },
        ],
      },
      { key: "gera", labelKey: "gera", type: "text" },
      { key: "notes", labelKey: "styleNotes", type: "text" },
    ],
  },
  waistcoat: {
    garmentType: "waistcoat",
    measurementFields: [
      { key: "neck", labelKey: "neck", group: "body", required: true },
      { key: "shoulder", labelKey: "shoulder", group: "body", required: true },
      { key: "chest", labelKey: "chest", group: "body", required: true },
      { key: "waist", labelKey: "waist", group: "body", required: true },
      { key: "hip", labelKey: "hip", group: "body" },
      { key: "waistcoatLength", labelKey: "waistcoatLength", group: "upper", required: true },
      { key: "armhole", labelKey: "armhole", group: "upper" },
      { key: "bicep", labelKey: "bicep", group: "upper" },
    ],
    styleFields: [
      {
        key: "buttonStyle",
        labelKey: "buttonStyle",
        type: "select",
        options: [
          { value: "singleBreast", labelKey: "singleBreast" },
          { value: "doubleBreast", labelKey: "doubleBreast" },
        ],
      },
      { key: "notes", labelKey: "styleNotes", type: "text" },
    ],
  },
};

const DEFAULT_BOOKING_GARMENT: BookingGarmentType = "shalwarQameez";

/** Map API / legacy garment keys to a booking-flow suit type. */
const legacyGarmentToBooking: Record<string, BookingGarmentType> = {
  shalwarQameez: "shalwarQameez",
  dressPantCoat: "dressPantCoat",
  coat: "dressPantCoat",
  sherwani: "sherwani",
  kurta: "kurta",
  waistcoat: "waistcoat",
  shirtOnly: "shalwarQameez",
  dressPantsOnly: "dressPantCoat",
  suit: "dressPantCoat",
  frock: "kurta",
};

export function normalizeBookingGarmentType(
  value?: string | null,
): BookingGarmentType {
  if (!value) return DEFAULT_BOOKING_GARMENT;
  if (value in garmentMeasurementSchemas) {
    return value as BookingGarmentType;
  }
  return legacyGarmentToBooking[value] ?? DEFAULT_BOOKING_GARMENT;
}

export function getGarmentSchema(
  garmentType?: string | null,
): GarmentMeasurementSchema {
  return garmentMeasurementSchemas[normalizeBookingGarmentType(garmentType)];
}

export function emptyMeasurementsForGarment(
  garmentType?: string | null,
): Record<string, string> {
  const schema = getGarmentSchema(garmentType);
  return Object.fromEntries(
    schema.measurementFields.map((f) => [f.key, ""]),
  );
}

export function emptyStyleForGarment(
  garmentType?: string | null,
): Record<string, string> {
  const schema = getGarmentSchema(garmentType);
  return Object.fromEntries(
    schema.styleFields.map((f) => {
      const defaultVal =
        f.type === "select" && f.options?.length ? f.options[0]!.value : "";
      return [f.key, defaultVal];
    }),
  );
}

/** Keys shared across most garments — copied when switching suit type. */
export const sharedMeasurementKeys = [
  "neck",
  "shoulder",
  "chest",
  "waist",
  "hip",
  "sleeve",
  "thigh",
] as const;

export function mergeMeasurementsForGarmentChange(
  garmentType: BookingGarmentType | string,
  previous: Record<string, string>,
): Record<string, string> {
  const next = emptyMeasurementsForGarment(garmentType);
  for (const key of sharedMeasurementKeys) {
    if (previous[key]?.trim()) {
      next[key] = previous[key];
    }
  }
  return next;
}
