"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut, Plus } from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { routes } from "@/core/config/routes";
import { canCreateOrders } from "@/core/auth/roles";
import { useLocale } from "@/core/i18n/locale-context";
import { useLogout, useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { getVisibleNavItems, isNavActive, navPath } from "./nav-items";
import { SidebarNavLink } from "./sidebar-nav-link";
import { BrandLogo } from "@/tailor/ui/shared/brand-logo";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  useSidebar,
} from "./sidebar-context";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const logout = useLogout();
  const { collapsed, toggleCollapsed } = useSidebar();
  const items = getVisibleNavItems(user?.role);
  const showNewOrder = canCreateOrders(user?.role);

  const initials = user?.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

  const collapseIcon = isRtl ? (
    collapsed ? (
      <ChevronLeft className="h-4 w-4" />
    ) : (
      <ChevronRight className="h-4 w-4" />
    )
  ) : collapsed ? (
    <ChevronRight className="h-4 w-4" />
  ) : (
    <ChevronLeft className="h-4 w-4" />
  );

  function handleLogout() {
    logout();
    router.replace(routes.login);
  }

  return (
    <aside
      style={{
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
      }}
      className={cn(
        "fixed inset-y-0 z-30 hidden flex-col overflow-hidden bg-gradient-to-b from-sidebar via-sidebar to-sidebar-dark shadow-2xl transition-[width] duration-200 ease-in-out md:flex",
        isRtl ? "right-0" : "left-0",
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-accent-500/10" />

      <div
        className={cn(
          "relative border-b border-white/10",
          collapsed ? "px-2 py-4" : "px-5 py-6",
        )}
      >
        <div
          className={cn(
            "flex items-center",
            collapsed
              ? "flex-col justify-center gap-2"
              : cn("justify-between gap-2", isRtl && "flex-row-reverse"),
          )}
        >
          <BrandLogo
            solutionsLabel={t.brand.solutionsChip}
            isRtl={isRtl}
            compact={collapsed}
            className={collapsed ? undefined : "min-w-0 flex-1"}
          />
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
            aria-label={collapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sidebar-text-muted transition hover:bg-white/10 hover:text-white"
          >
            {collapseIcon}
          </button>
        </div>
      </div>

      <nav
        className={cn(
          "relative flex-1 space-y-1.5 overflow-y-auto py-5",
          collapsed ? "px-2" : "px-3",
        )}
      >
        {!collapsed ? (
          <p
            className={cn(
              "mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-sidebar-text-muted/70",
              isRtl && "text-right",
            )}
          >
            {t.nav.home}
          </p>
        ) : null}
        {items.map(({ segment, icon, labelKey }) => (
          <SidebarNavLink
            key={labelKey}
            href={navPath(segment)}
            label={t.nav[labelKey]}
            icon={icon}
            active={isNavActive(pathname, segment)}
            isRtl={isRtl}
            compact={collapsed}
          />
        ))}
      </nav>

      <div
        className={cn(
          "relative space-y-3 border-t border-white/10",
          collapsed ? "p-2" : "p-4",
        )}
      >
        {showNewOrder ? (
        <Link
          href={routes.newOrder}
          title={collapsed ? t.nav.newOrder : undefined}
          aria-label={collapsed ? t.nav.newOrder : undefined}
          className={cn(
            "sidebar-new-order flex items-center justify-center rounded-2xl bg-gradient-to-r from-accent-500 to-accent-400 text-sm font-bold text-white shadow-lg shadow-accent-500/25 transition hover:brightness-105 active:scale-[0.98]",
            collapsed ? "h-11 w-full" : "w-full gap-2 px-4 py-3",
            isRtl && !collapsed && "flex-row-reverse",
          )}
        >
          <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} />
          {!collapsed ? t.nav.newOrder : null}
        </Link>
        ) : null}

        {user ? (
          collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-sidebar"
                title={user.name}
              >
                {initials}
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
          ) : (
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
                <p className="truncate text-xs text-sidebar-text-muted" dir="ltr">
                  {user.email ?? user.phone}
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
          )
        ) : null}
      </div>
    </aside>
  );
}
