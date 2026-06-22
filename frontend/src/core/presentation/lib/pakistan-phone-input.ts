import { isValidPakistanPhone } from "@shared";

/** Pakistani mobile: 03XXXXXXXXX (11 digits). */
export const PAKISTAN_PHONE_MAX_LENGTH = 11;

/** Strip non-digits and cap length for phone fields. */
export function sanitizePakistanPhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, PAKISTAN_PHONE_MAX_LENGTH);
}

/** Login accepts email or mobile — only sanitize when it looks like a number. */
export function sanitizeLoginIdentifierInput(value: string): string {
  if (/[a-zA-Z@]/.test(value)) return value;
  return sanitizePakistanPhoneInput(value);
}

export function phoneInputErrorClass(invalid: boolean): string | undefined {
  return invalid ? "border-rose-300 focus:ring-rose-400" : undefined;
}

export function validatePakistanPhoneField(
  value: string,
  options: {
    required?: boolean;
    requiredMessage?: string;
    invalidMessage: string;
  },
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return options.required ? options.requiredMessage : undefined;
  }
  if (!isValidPakistanPhone(trimmed)) {
    return options.invalidMessage;
  }
  return undefined;
}
