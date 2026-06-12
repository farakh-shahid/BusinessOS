import { BadRequestException } from "@nestjs/common";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmailAddress(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** Digits-only phone for lookup/storage (min 7 digits). */
export function normalizeUserPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7) {
    throw new BadRequestException("Enter a valid phone number (at least 7 digits)");
  }
  return digits;
}

export function normalizeUserEmail(value: string): string {
  const email = value.trim().toLowerCase();
  if (!isEmailAddress(email)) {
    throw new BadRequestException("Enter a valid email address");
  }
  return email;
}

export function parseLoginIdentifier(login: string): {
  type: "email" | "phone";
  value: string;
} {
  const trimmed = login.trim();
  if (!trimmed) {
    throw new BadRequestException("Email or phone is required");
  }
  if (trimmed.includes("@")) {
    return { type: "email", value: normalizeUserEmail(trimmed) };
  }
  return { type: "phone", value: normalizeUserPhone(trimmed) };
}
