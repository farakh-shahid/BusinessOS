import { BadRequestException } from "@nestjs/common";
import { requirePakistanPhone } from "./pakistan-phone.util";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmailAddress(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** Pakistani mobile in local format, e.g. 03001234567 */
export function normalizeUserPhone(value: string): string {
  return requirePakistanPhone(value);
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
