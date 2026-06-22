import { LOCALES, type Locale } from "@shared";

export { LOCALES };

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
