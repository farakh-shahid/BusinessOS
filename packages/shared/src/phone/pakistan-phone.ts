import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

const COUNTRY = "PK" as const;

/** Local Pakistani mobile format: 03XXXXXXXXX (11 digits). */
const PK_MOBILE_LOCAL = /^03[0-9]{9}$/;

/** Whether the value is a valid Pakistani mobile number. */
export function isValidPakistanPhone(value: string): boolean {
  return normalizePakistanPhone(value) !== null;
}

/**
 * Normalize to local Pakistani mobile format without spaces, e.g. `03001234567`.
 * Returns null when the number is invalid.
 */
export function normalizePakistanPhone(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (!isValidPhoneNumber(trimmed, COUNTRY)) return null;

  const parsed = parsePhoneNumberFromString(trimmed, COUNTRY);
  if (!parsed?.isValid()) return null;

  const local = parsed.formatNational().replace(/[\s-]/g, "");
  if (!PK_MOBILE_LOCAL.test(local)) return null;

  return local;
}
