"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = exports.GarmentType = exports.FabricSource = exports.PlacketType = exports.CollarType = exports.PocketOption = exports.MeasurementUnit = exports.LocalePreference = exports.UserRole = void 0;
exports.UserRole = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    STAFF: 'STAFF'
};
exports.LocalePreference = {
    EN: 'EN',
    UR: 'UR'
};
exports.MeasurementUnit = {
    INCHES: 'INCHES',
    CM: 'CM'
};
exports.PocketOption = {
    NONE: 'NONE',
    SINGLE: 'SINGLE',
    DOUBLE: 'DOUBLE'
};
exports.CollarType = {
    REGULAR: 'REGULAR',
    BAN: 'BAN',
    SPREAD: 'SPREAD',
    OTHER: 'OTHER'
};
exports.PlacketType = {
    REGULAR: 'REGULAR',
    HIDDEN: 'HIDDEN',
    OTHER: 'OTHER'
};
exports.FabricSource = {
    CUSTOMER: 'CUSTOMER',
    SHOP: 'SHOP'
};
exports.GarmentType = {
    SHALWAR_QAMEEZ: 'SHALWAR_QAMEEZ',
    SHERWANI: 'SHERWANI',
    SUIT: 'SUIT',
    FROCK: 'FROCK',
    KURTA: 'KURTA',
    WAISTCOAT: 'WAISTCOAT'
};
exports.OrderStatus = {
    PENDING: 'PENDING',
    CUTTING: 'CUTTING',
    STITCHING: 'STITCHING',
    READY: 'READY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
};
//# sourceMappingURL=enums.js.map