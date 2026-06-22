"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.NullsOrder = exports.JsonNullValueFilter = exports.QueryMode = exports.JsonNullValueInput = exports.SortOrder = exports.OrderScalarFieldEnum = exports.MeasurementScalarFieldEnum = exports.CustomerScalarFieldEnum = exports.UserScalarFieldEnum = exports.TenantScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = require("@prisma/client/runtime/client");
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.8.0",
    engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Tenant: 'Tenant',
    User: 'User',
    Customer: 'Customer',
    Measurement: 'Measurement',
    Order: 'Order'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.TenantScalarFieldEnum = {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    permissions: 'permissions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CustomerScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    phone: 'phone',
    email: 'email',
    preferredLocale: 'preferredLocale',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.MeasurementScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    customerId: 'customerId',
    takenByUserId: 'takenByUserId',
    unit: 'unit',
    chest: 'chest',
    waist: 'waist',
    shoulder: 'shoulder',
    sleeve: 'sleeve',
    neck: 'neck',
    shirtLength: 'shirtLength',
    trouserLength: 'trouserLength',
    hip: 'hip',
    thigh: 'thigh',
    chestPocket: 'chestPocket',
    sidePockets: 'sidePockets',
    collar: 'collar',
    placket: 'placket',
    gera: 'gera',
    notes: 'notes',
    emailSentAt: 'emailSentAt',
    createdAt: 'createdAt'
};
exports.OrderScalarFieldEnum = {
    id: 'id',
    tenantId: 'tenantId',
    customerId: 'customerId',
    createdByUserId: 'createdByUserId',
    measurementId: 'measurementId',
    orderNumber: 'orderNumber',
    status: 'status',
    garmentType: 'garmentType',
    deliveryDate: 'deliveryDate',
    fabricSource: 'fabricSource',
    fabricNotes: 'fabricNotes',
    chestPocket: 'chestPocket',
    sidePockets: 'sidePockets',
    collar: 'collar',
    placket: 'placket',
    gera: 'gera',
    styleNotes: 'styleNotes',
    advancePaid: 'advancePaid',
    totalPrice: 'totalPrice',
    balanceDue: 'balanceDue',
    isRush: 'isRush',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map