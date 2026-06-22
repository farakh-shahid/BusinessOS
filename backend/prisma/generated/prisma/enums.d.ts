export declare const UserRole: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly ADMIN: "ADMIN";
    readonly STAFF: "STAFF";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const LocalePreference: {
    readonly EN: "EN";
    readonly UR: "UR";
};
export type LocalePreference = (typeof LocalePreference)[keyof typeof LocalePreference];
export declare const MeasurementUnit: {
    readonly INCHES: "INCHES";
    readonly CM: "CM";
};
export type MeasurementUnit = (typeof MeasurementUnit)[keyof typeof MeasurementUnit];
export declare const PocketOption: {
    readonly NONE: "NONE";
    readonly SINGLE: "SINGLE";
    readonly DOUBLE: "DOUBLE";
};
export type PocketOption = (typeof PocketOption)[keyof typeof PocketOption];
export declare const CollarType: {
    readonly REGULAR: "REGULAR";
    readonly BAN: "BAN";
    readonly SPREAD: "SPREAD";
    readonly OTHER: "OTHER";
};
export type CollarType = (typeof CollarType)[keyof typeof CollarType];
export declare const PlacketType: {
    readonly REGULAR: "REGULAR";
    readonly HIDDEN: "HIDDEN";
    readonly OTHER: "OTHER";
};
export type PlacketType = (typeof PlacketType)[keyof typeof PlacketType];
export declare const FabricSource: {
    readonly CUSTOMER: "CUSTOMER";
    readonly SHOP: "SHOP";
};
export type FabricSource = (typeof FabricSource)[keyof typeof FabricSource];
export declare const GarmentType: {
    readonly SHALWAR_QAMEEZ: "SHALWAR_QAMEEZ";
    readonly SHERWANI: "SHERWANI";
    readonly SUIT: "SUIT";
    readonly FROCK: "FROCK";
    readonly KURTA: "KURTA";
    readonly WAISTCOAT: "WAISTCOAT";
};
export type GarmentType = (typeof GarmentType)[keyof typeof GarmentType];
export declare const OrderStatus: {
    readonly PENDING: "PENDING";
    readonly CUTTING: "CUTTING";
    readonly STITCHING: "STITCHING";
    readonly READY: "READY";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
