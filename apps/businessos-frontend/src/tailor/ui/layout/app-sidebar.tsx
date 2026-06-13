"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { useLogout, useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { getVisibleNavItems, isNavActive, navPath } from "./nav-items";
import { SidebarNavLink } from "./sidebar-nav-link";
import { BrandLogo } from "@/tailor/ui/shared/brand-logo";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const logout = useLogout();
  const items = getVisibleNavItems(user?.role);

  const initials = user?.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

  function handleLogout() {
    logout();
    router.replace(routes.login);
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 z-30 hidden w-[17.5rem] flex-col overflow-hidden bg-gradient-to-b from-sidebar via-sidebar to-sidebar-dark shadow-2xl md:flex",
        isRtl ? "right-0" : "left-0",
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-accent-500/10" />

      <div className="relative border-b border-white/10 px-5 py-6">
        <BrandLogo solutionsLabel={t.brand.solutionsChip} isRtl={isRtl} />
      </div>

      <nav className="relative flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
        <p
          className={cn(
            "mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-sidebar-text-muted/70",
            isRtl && "text-right",
          )}
        >
          {t.nav.home}
        </p>
        {items.map(({ segment, icon, labelKey }) => (
          <SidebarNavLink
            key={labelKey}
            href={navPath(segment)}
            label={t.nav[labelKey]}
            icon={icon}
            active={isNavActive(pathname, segment)}
            isRtl={isRtl}
          />
        ))}
      </nav>

      <div className="relative space-y-3 border-t border-white/10 p-4">
        <Link
          href={routes.newOrder}
          className={cn(
            "sidebar-new-order flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-400 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-accent-500/25 transition hover:brightness-105 active:scale-[0.98]",
            isRtl && "flex-row-reverse",
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {t.nav.newOrder}
        </Link>

        {user && (
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10",
              isRtl && "flex-row-reverse",
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-sidebar">
              {initials}
            </div>
            <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
              <p className="truncate text-sm font-semibold text-white">
                {user.name}
              </p>
              <p className="truncate text-xs text-sidebar-text-muted">
                {user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title={t.auth.logout}
              className="sidebar-logout flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sidebar-text transition hover:bg-white/10 hover:text-white"
              aria-label={t.auth.logout}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
