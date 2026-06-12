import type { Dictionary } from "@business-os/i18n";
import { ApiError } from "@/core/infrastructure/api/api-client";

export function resolveApiErrorMessage(
  err: unknown,
  t: Dictionary,
): string {
  if (err instanceof ApiError) {
    const msg = err.message.trim();

    if (
      /measurement|inches|out of range|numeric|overflow/i.test(msg)
    ) {
      return msg.includes("between") || msg.includes("e.g.")
        ? msg
        : t.errors.measurementOutOfRange;
    }

    if (err.status === 401) {
      return t.auth.invalidCredentials;
    }

    if (err.status === 400 && msg && !msg.startsWith("Request failed")) {
      return msg;
    }

    if (err.status >= 500) {
      return t.errors.serverError;
    }

    if (msg && !msg.startsWith("Request failed")) {
      return msg;
    }

    return t.errors.requestFailed;
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return t.errors.generic;
}
