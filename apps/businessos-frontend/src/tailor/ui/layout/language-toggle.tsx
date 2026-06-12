"use client";

import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex rounded-full border border-slate-200 bg-white p-0.5 text-xs font-semibold shadow-sm">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-full px-3 py-1.5 transition-colors",
          locale === "en"
            ? "bg-brand-700 text-white"
            : "text-slate-500 hover:text-slate-700",
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("ur")}
        className={cn(
          "rounded-full px-3 py-1.5 transition-colors",
          locale === "ur"
            ? "bg-brand-700 text-white"
            : "text-slate-500 hover:text-slate-700",
        )}
      >
        اردو
      </button>
    </div>
  );
}
