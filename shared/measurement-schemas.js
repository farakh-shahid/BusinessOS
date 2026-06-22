"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedMeasurementKeys = exports.garmentMeasurementSchemas = exports.masterWorksheetMeasurementFields = exports.bookingGarmentTypes = void 0;
exports.normalizeBookingGarmentType = normalizeBookingGarmentType;
exports.getGarmentSchema = getGarmentSchema;
exports.getWorksheetMeasurementFields = getWorksheetMeasurementFields;
exports.emptyMeasurementsForGarment = emptyMeasurementsForGarment;
exports.emptyStyleForGarment = emptyStyleForGarment;
exports.mergeMeasurementsForGarmentChange = mergeMeasurementsForGarmentChange;
exports.normalizeMeasurementValues = normalizeMeasurementValues;
exports.bookingGarmentTypes = [
    "shalwarQameez",
    "dressPantCoat",
    "sherwani",
    "kurta",
    "waistcoat",
];
exports.masterWorksheetMeasurementFields = [
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
const masterFieldMap = Object.fromEntries(exports.masterWorksheetMeasurementFields.map((field) => [field.key, field]));
function pickFields(specs) {
    return specs.map(({ key, required }) => {
        const base = masterFieldMap[key];
        if (!base) {
            throw new Error(`Unknown measurement field: ${key}`);
        }
        return { ...base, required: required ?? false };
    });
}
exports.garmentMeasurementSchemas = {
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
const DEFAULT_BOOKING_GARMENT = "shalwarQameez";
const legacyGarmentToBooking = {
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
const legacyMeasurementKeyAliases = {
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
function normalizeBookingGarmentType(value) {
    if (!value)
        return DEFAULT_BOOKING_GARMENT;
    if (value in exports.garmentMeasurementSchemas) {
        return value;
    }
    return legacyGarmentToBooking[value] ?? DEFAULT_BOOKING_GARMENT;
}
function getGarmentSchema(garmentType) {
    return exports.garmentMeasurementSchemas[normalizeBookingGarmentType(garmentType)];
}
function getWorksheetMeasurementFields() {
    return exports.masterWorksheetMeasurementFields;
}
function emptyMeasurementsForGarment(_garmentType) {
    return Object.fromEntries(exports.masterWorksheetMeasurementFields.map((field) => [field.key, ""]));
}
function emptyStyleForGarment(garmentType) {
    const schema = getGarmentSchema(garmentType);
    return Object.fromEntries(schema.styleFields.map((field) => {
        const defaultVal = field.type === "select" && field.options?.length
            ? field.options[0].value
            : "";
        return [field.key, defaultVal];
    }));
}
exports.sharedMeasurementKeys = [
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
];
function normalizeLegacyMeasurementKey(key) {
    return legacyMeasurementKeyAliases[key] ?? key;
}
function mergeMeasurementsForGarmentChange(_garmentType, previous) {
    const next = emptyMeasurementsForGarment();
    for (const [rawKey, value] of Object.entries(previous)) {
        if (!value?.trim())
            continue;
        const key = normalizeLegacyMeasurementKey(rawKey);
        if (key in next) {
            next[key] = value;
        }
    }
    return next;
}
function normalizeMeasurementValues(values) {
    const normalized = emptyMeasurementsForGarment();
    for (const [rawKey, rawValue] of Object.entries(values)) {
        if (rawValue === undefined || rawValue === null)
            continue;
        const text = String(rawValue).trim();
        if (!text)
            continue;
        const key = normalizeLegacyMeasurementKey(rawKey);
        if (key in normalized) {
            normalized[key] = text;
        }
    }
    return normalized;
}
//# sourceMappingURL=measurement-schemas.js.map