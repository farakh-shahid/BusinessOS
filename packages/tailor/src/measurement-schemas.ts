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

/** Matches the tailor shop worksheet: SIZE (trousers) + main chart. */
export type MeasurementFieldGroup = "size" | "main";

export interface MeasurementFieldDef {
  key: string;
  labelKey: string;
  type?: MeasurementFieldType;
  required?: boolean;
  group?: MeasurementFieldGroup;
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

/**
 * Master worksheet chart — same fields as the printed tailor form.
 * Labels use English (Urdu) via i18n `measurements.*` keys.
 */
export const masterWorksheetMeasurementFields: MeasurementFieldDef[] = [
  { key: "trouserLength", labelKey: "trouserLength", group: "size" },
  { key: "waist", labelKey: "waist", group: "size" },
  { key: "hip", labelKey: "hip", group: "size" },
  { key: "crotch", labelKey: "crotch", group: "size" },
  { key: "knee", labelKey: "knee", group: "size" },
  { key: "trouserBottom", labelKey: "trouserBottom", group: "size" },
  { key: "coatLength", labelKey: "coatLength", group: "main" },
  { key: "qameezLength", labelKey: "qameezLength", group: "main" },
  { key: "shirtLength", labelKey: "shirtLength", group: "main" },
  { key: "sherwaniLength", labelKey: "sherwaniLength", group: "main" },
  { key: "waistcoatLength", labelKey: "waistcoatLength", group: "main" },
  { key: "chest", labelKey: "chest", group: "main" },
  { key: "shoulder", labelKey: "shoulder", group: "main" },
  { key: "sleeve", labelKey: "sleeve", group: "main" },
  { key: "crossBack", labelKey: "crossBack", group: "main" },
  { key: "cuffOpening", labelKey: "cuffOpening", group: "main" },
  { key: "collarSize", labelKey: "collarSize", group: "main" },
  { key: "bandCollar", labelKey: "bandCollar", group: "main" },
  { key: "shalwarLength", labelKey: "shalwarLength", group: "main" },
  { key: "shalwarBottom", labelKey: "shalwarBottom", group: "main" },
  { key: "frontPocket", labelKey: "frontPocket", group: "main" },
  { key: "sidePocket", labelKey: "sidePocket", group: "main" },
  { key: "shalwarPocket", labelKey: "shalwarPocket", group: "main" },
];

const masterFieldMap = Object.fromEntries(
  masterWorksheetMeasurementFields.map((field) => [field.key, field]),
) as Record<string, MeasurementFieldDef>;

function pickFields(
  specs: Array<{ key: string; required?: boolean }>,
): MeasurementFieldDef[] {
  return specs.map(({ key, required }) => {
    const base = masterFieldMap[key];
    if (!base) {
      throw new Error(`Unknown measurement field: ${key}`);
    }
    return { ...base, required: required ?? false };
  });
}

/** Pakistani tailor-style measurement charts per garment (inches). */
export const garmentMeasurementSchemas: Record<
  BookingGarmentType,
  GarmentMeasurementSchema
> = {
  shalwarQameez: {
    garmentType: "shalwarQameez",
    measurementFields: pickFields([
      { key: "qameezLength", required: true },
      { key: "shalwarLength", required: true },
      { key: "chest", required: true },
      { key: "waist", required: true },
      { key: "shoulder", required: true },
      { key: "sleeve", required: true },
      { key: "hip" },
      { key: "crossBack" },
      { key: "cuffOpening" },
      { key: "collarSize" },
      { key: "bandCollar" },
      { key: "shalwarBottom" },
      { key: "frontPocket" },
      { key: "sidePocket" },
      { key: "shalwarPocket" },
    ]),
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
      { key: "gera", labelKey: "gera", type: "text" },
      { key: "notes", labelKey: "styleNotes", type: "text" },
    ],
  },
  dressPantCoat: {
    garmentType: "dressPantCoat",
    measurementFields: pickFields([
      { key: "coatLength", required: true },
      { key: "trouserLength", required: true },
      { key: "chest", required: true },
      { key: "waist", required: true },
      { key: "shoulder", required: true },
      { key: "sleeve", required: true },
      { key: "hip", required: true },
      { key: "crotch" },
      { key: "knee" },
      { key: "trouserBottom" },
      { key: "crossBack" },
      { key: "cuffOpening" },
      { key: "collarSize" },
    ]),
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
    measurementFields: pickFields([
      { key: "sherwaniLength", required: true },
      { key: "chest", required: true },
      { key: "waist", required: true },
      { key: "shoulder", required: true },
      { key: "sleeve", required: true },
      { key: "hip" },
      { key: "crossBack" },
      { key: "cuffOpening" },
      { key: "collarSize" },
      { key: "bandCollar" },
      { key: "trouserLength" },
      { key: "trouserBottom" },
    ]),
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
    measurementFields: pickFields([
      { key: "qameezLength", required: true },
      { key: "chest", required: true },
      { key: "waist", required: true },
      { key: "shoulder", required: true },
      { key: "sleeve", required: true },
      { key: "hip" },
      { key: "crossBack" },
      { key: "cuffOpening" },
      { key: "collarSize" },
      { key: "bandCollar" },
      { key: "shalwarLength" },
      { key: "shalwarBottom" },
    ]),
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
    measurementFields: pickFields([
      { key: "waistcoatLength", required: true },
      { key: "chest", required: true },
      { key: "waist", required: true },
      { key: "shoulder", required: true },
      { key: "crossBack" },
      { key: "cuffOpening" },
    ]),
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

/** Legacy measurement keys mapped to the new worksheet chart. */
const legacyMeasurementKeyAliases: Record<string, string> = {
  wrist: "cuffOpening",
  inseam: "crotch",
  neck: "collarSize",
  armhole: "crossBack",
  bicep: "cuffOpening",
  thigh: "hip",
  stomach: "waist",
  kurtaLength: "qameezLength",
  pajamaLength: "shalwarLength",
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

export function getWorksheetMeasurementFields(): MeasurementFieldDef[] {
  return masterWorksheetMeasurementFields;
}

export function emptyMeasurementsForGarment(
  _garmentType?: string | null,
): Record<string, string> {
  return Object.fromEntries(
    masterWorksheetMeasurementFields.map((field) => [field.key, ""]),
  );
}

export function emptyStyleForGarment(
  garmentType?: string | null,
): Record<string, string> {
  const schema = getGarmentSchema(garmentType);
  return Object.fromEntries(
    schema.styleFields.map((field) => {
      const defaultVal =
        field.type === "select" && field.options?.length
          ? field.options[0]!.value
          : "";
      return [field.key, defaultVal];
    }),
  );
}

/** Keys shared across most garments — copied when switching suit type. */
export const sharedMeasurementKeys = [
  "chest",
  "waist",
  "shoulder",
  "sleeve",
  "hip",
  "qameezLength",
  "shalwarLength",
  "trouserLength",
  "coatLength",
  "crossBack",
  "cuffOpening",
] as const;

function normalizeLegacyMeasurementKey(key: string): string {
  return legacyMeasurementKeyAliases[key] ?? key;
}

export function mergeMeasurementsForGarmentChange(
  _garmentType: BookingGarmentType | string,
  previous: Record<string, string>,
): Record<string, string> {
  const next = emptyMeasurementsForGarment();
  for (const [rawKey, value] of Object.entries(previous)) {
    if (!value?.trim()) continue;
    const key = normalizeLegacyMeasurementKey(rawKey);
    if (key in next) {
      next[key] = value;
    }
  }
  return next;
}

export function normalizeMeasurementValues(
  values: Record<string, string | number | undefined>,
): Record<string, string> {
  const normalized = emptyMeasurementsForGarment();
  for (const [rawKey, rawValue] of Object.entries(values)) {
    if (rawValue === undefined || rawValue === null) continue;
    const text = String(rawValue).trim();
    if (!text) continue;
    const key = normalizeLegacyMeasurementKey(rawKey);
    if (key in normalized) {
      normalized[key] = text;
    }
  }
  return normalized;
}
