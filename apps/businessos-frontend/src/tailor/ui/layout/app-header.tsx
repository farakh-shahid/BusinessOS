"use client";

import Link from "next/link";
import { Bell, Plus, Scissors } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { LanguageToggle } from "./language-toggle";

export function AppHeader() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-4",
        isRtl && "flex-row-reverse",
      )}
    >
      <div
        className={cn(
          "flex min-w-0 items-center gap-3 md:hidden",
          isRtl && "flex-row-reverse",
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar to-sidebar-dark text-white shadow-md">
          <Scissors className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className={cn("min-w-0", isRtl && "text-right")}>
          <p className="truncate text-sm font-bold text-sidebar">
            {firstName ? `${t.analytics.hello} ${firstName}` : t.appName}
          </p>
          <p className="truncate text-xs text-slate-500">{t.appTagline}</p>
        </div>
      </div>

      <div className={cn("flex items-center gap-2", isRtl && "flex-row-reverse")}>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm md:hidden"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <LanguageToggle />
        <Link
          href={routes.newOrder}
          className={cn(
            "hidden items-center gap-2 rounded-xl bg-gradient-to-r from-sidebar to-sidebar-dark px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sidebar-dark/25 transition hover:brightness-105 md:inline-flex",
            isRtl && "flex-row-reverse",
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {t.nav.newOrder}
        </Link>
      </div>
    </header>
  );
}
