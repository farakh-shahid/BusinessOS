import { normalizePakistanPhone } from "@business-os/shared";
import { BadRequestException } from "@nestjs/common";

const INVALID_MESSAGE =
  "Enter a valid Pakistani mobile number (e.g. 03001234567)";

export function requirePakistanPhone(value: string): string {
  const normalized = normalizePakistanPhone(value);
  if (!normalized) {
    throw new BadRequestException(INVALID_MESSAGE);
  }
  return normalized;
}
