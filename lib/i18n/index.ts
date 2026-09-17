import { en } from "./en";
import { sv } from "./sv";
import { da } from "./da";
import { no } from "./no";
import { fi } from "./fi";
import { is } from "./is";
import type { Dictionary, Locale } from "./types";

export type { Dictionary, Locale } from "./types";
export { LANG_META, LOCALE_STORAGE_KEY, DEFAULT_LOCALE } from "./types";

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  sv,
  da,
  no,
  fi,
  is,
};

const LOCALES: Locale[] = ["sv", "en", "da", "no", "fi", "is"];

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}
