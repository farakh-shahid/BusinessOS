export type BookingGarmentType = "shalwarQameez" | "dressPantCoat" | "sherwani" | "kurta" | "waistcoat";
export declare const bookingGarmentTypes: BookingGarmentType[];
export type MeasurementFieldType = "number" | "text";
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
    options?: Array<{
        value: string;
        labelKey: string;
    }>;
}
export interface GarmentMeasurementSchema {
    garmentType: BookingGarmentType;
    measurementFields: MeasurementFieldDef[];
    styleFields: StyleFieldDef[];
}
export declare const masterWorksheetMeasurementFields: MeasurementFieldDef[];
export declare const garmentMeasurementSchemas: Record<BookingGarmentType, GarmentMeasurementSchema>;
export declare function normalizeBookingGarmentType(value?: string | null): BookingGarmentType;
export declare function getGarmentSchema(garmentType?: string | null): GarmentMeasurementSchema;
export declare function getWorksheetMeasurementFields(): MeasurementFieldDef[];
export declare function emptyMeasurementsForGarment(_garmentType?: string | null): Record<string, string>;
export declare function emptyStyleForGarment(garmentType?: string | null): Record<string, string>;
export declare const sharedMeasurementKeys: readonly ["chest", "waist", "shoulder", "sleeve", "hip", "qameezLength", "shalwarLength", "trouserLength", "coatLength", "crossBack", "cuffOpening"];
export declare function mergeMeasurementsForGarmentChange(_garmentType: BookingGarmentType | string, previous: Record<string, string>): Record<string, string>;
export declare function normalizeMeasurementValues(values: Record<string, string | number | undefined>): Record<string, string>;
