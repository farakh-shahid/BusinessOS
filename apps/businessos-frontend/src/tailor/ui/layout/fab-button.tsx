"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";

/** Height of mobile bottom nav + gap — keeps FAB above tab bar */
const FAB_BOTTOM =
  "calc(5.5rem + max(0.65rem, env(safe-area-inset-bottom)) + 0.75rem)";

export function FabButton() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  return (
    <Link
      href={routes.newOrder}
      aria-label={t.nav.newOrder}
      style={{ bottom: FAB_BOTTOM }}
      className={cn(
        "fixed z-[60] flex h-14 w-14 items-center justify-center rounded-full",
        "bg-gradient-to-br from-accent-500 to-accent-600 text-white",
        "shadow-lg shadow-accent-500/40 ring-4 ring-white/90",
        "transition hover:from-accent-600 hover:to-accent-700 active:scale-95",
        "md:hidden",
        isRtl ? "left-5" : "right-5",
      )}
    >
      <Plus className="h-7 w-7" strokeWidth={2.5} />
    </Link>
  );
}
