"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";

export function FabButton() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  return (
    <Link
      href={routes.newOrder}
      aria-label={t.nav.newOrder}
      className={cn(
        "fixed bottom-[6.75rem] z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-accent-400 text-white shadow-xl shadow-accent-500/35 transition active:scale-95 md:hidden",
        isRtl ? "left-5" : "right-5",
      )}
    >
      <Plus className="h-7 w-7" strokeWidth={2.5} />
    </Link>
  );
}
