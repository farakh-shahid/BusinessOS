import type { Locale } from "@business-os/shared";
import en from "./locales/en.json";
import ur from "./locales/ur.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, ur };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
