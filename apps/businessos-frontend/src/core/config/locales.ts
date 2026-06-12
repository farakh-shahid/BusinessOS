import { LOCALES, type Locale } from "@business-os/shared";

export { LOCALES };

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
