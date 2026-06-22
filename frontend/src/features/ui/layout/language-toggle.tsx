"use client";

import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={cn("lang", className)} dir="ltr" role="group" aria-label="Language">
      <button
        type="button"
        data-l="EN"
        className={locale === "en" ? "on" : undefined}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        data-l="UR"
        className={locale === "ur" ? "on" : undefined}
        onClick={() => setLocale("ur")}
        aria-pressed={locale === "ur"}
      >
        اردو
      </button>
    </div>
  );
}
