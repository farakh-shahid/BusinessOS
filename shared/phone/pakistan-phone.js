"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPakistanPhone = isValidPakistanPhone;
exports.normalizePakistanPhone = normalizePakistanPhone;
const libphonenumber_js_1 = require("libphonenumber-js");
const COUNTRY = "PK";
const PK_MOBILE_LOCAL = /^03[0-9]{9}$/;
function isValidPakistanPhone(value) {
    return normalizePakistanPhone(value) !== null;
}
function normalizePakistanPhone(value) {
    const trimmed = value.trim();
    if (!trimmed)
        return null;
    if (!(0, libphonenumber_js_1.isValidPhoneNumber)(trimmed, COUNTRY))
        return null;
    const parsed = (0, libphonenumber_js_1.parsePhoneNumberFromString)(trimmed, COUNTRY);
    if (!parsed?.isValid())
        return null;
    const local = parsed.formatNational().replace(/[\s-]/g, "");
    if (!PK_MOBILE_LOCAL.test(local))
        return null;
    return local;
}
//# sourceMappingURL=pakistan-phone.js.map