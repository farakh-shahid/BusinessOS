"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  Ellipsis,
  Home,
  LogOut,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getDictionary } from "@/i18n";
import { routes } from "@/core/config/routes";
import { canCreateOrders } from "@/core/auth/roles";
import { cn } from "@/core/presentation/lib/utils";
import { BottomSheet } from "@/core/presentation/components/ui/bottom-sheet";
import { useLocale } from "@/core/i18n/locale-context";
import { useLogout, useMeQuery } from "@/features/infrastructure/api/hooks/use-auth";
import {
  getMobileMoreNavItems,
  isNavActive,
  navPath,
  type NavItem,
} from "./nav-items";

function MobileBottomNavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-w-0 flex-col items-center justify-end gap-1 px-1 py-1.5 transition-colors",
        active ? "text-accent-500" : "text-muted-slate hover:text-foreground",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
      <span className="max-w-full truncate text-[10px] font-semibold leading-tight">
        {label}
      </span>
    </Link>
  );
}

function MobileMoreNavButton({
  label,
  active,
  open,
  onClick,
}: {
  label: string;
  active: boolean;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-haspopup="dialog"
      className={cn(
        "flex min-w-0 flex-col items-center justify-end gap-1 px-1 py-1.5 transition-colors",
        active || open
          ? "text-accent-500"
          : "text-muted-slate hover:text-foreground",
      )}
    >
      <Ellipsis
        className="h-5 w-5 shrink-0"
        strokeWidth={active || open ? 2.5 : 2}
      />
      <span className="max-w-full truncate text-[10px] font-semibold leading-tight">
        {label}
      </span>
    </button>
  );
}

function MobileMoreNavSheet({
  open,
  items,
  pathname,
  t,
  isRtl,
  onClose,
  onLogout,
}: {
  open: boolean;
  items: NavItem[];
  pathname: string;
  t: ReturnType<typeof getDictionary>;
  isRtl: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <BottomSheet
      open={open}
      title={t.nav.more}
      onClose={onClose}
      isRtl={isRtl}
    >
      <ul className="space-y-2">
        {items.map(({ segment, icon: Icon, labelKey }) => {
          const active = isNavActive(pathname, segment);

          return (
            <li key={segment}>
              <Link
                href={navPath(segment)}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                  isRtl && "flex-row-reverse text-right",
                  active
                    ? "border-brand-700 bg-brand-50 text-brand-900"
                    : "border-hairline bg-card text-foreground hover:border-brand-200",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active ? "text-brand-700" : "text-slate-500",
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
                {t.nav[labelKey]}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 border-t border-hairline pt-4">
        <button
          type="button"
          onClick={() => {
            onClose();
            onLogout();
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border border-hairline bg-card px-4 py-3 text-sm font-semibold text-rose-600 transition-colors hover:border-rose-200 hover:bg-rose-50",
            isRtl && "flex-row-reverse text-right",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" strokeWidth={2} />
          {t.auth.logout}
        </button>
      </div>
    </BottomSheet>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const logout = useLogout();
  const showNewOrder = canCreateOrders(user?.role);
  const moreItems = getMobileMoreNavItems(user?.role);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreItems.some((item) =>
    isNavActive(pathname, item.segment),
  );

  function handleLogout() {
    logout();
    router.replace(routes.login);
  }

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="mobile-nav-shell pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden">
        <nav
          className="mobile-nav-dock pointer-events-auto mx-auto max-w-lg"
          aria-label="Main navigation"
        >
          <div className="mobile-nav-dock-inner grid grid-cols-5 items-end px-2 pb-2 pt-2.5">
            <MobileBottomNavLink
              href={navPath("dashboard")}
              label={t.nav.home}
              icon={Home}
              active={isNavActive(pathname, "dashboard")}
            />
            <MobileBottomNavLink
              href={navPath("orders")}
              label={t.nav.orders}
              icon={ClipboardList}
              active={isNavActive(pathname, "orders")}
            />

            <div className="flex justify-center pb-1">
              {showNewOrder ? (
              <Link
                href={routes.newOrder}
                aria-label={t.nav.newOrder}
                className="-mt-7 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-accent-500 text-white shadow-[0_8px_24px_rgba(255,106,43,0.45),0_2px_6px_rgba(14,26,54,0.12)] ring-[3px] ring-white/80 transition hover:brightness-105 active:scale-95"
              >
                <Plus className="h-7 w-7" strokeWidth={2.5} />
              </Link>
              ) : (
                <div className="h-14 w-14" aria-hidden />
              )}
            </div>

            <MobileBottomNavLink
              href={navPath("customers")}
              label={t.nav.customers}
              icon={Users}
              active={isNavActive(pathname, "customers")}
            />

            <MobileMoreNavButton
              label={t.nav.more}
              active={moreActive}
              open={moreOpen}
              onClick={() => setMoreOpen(true)}
            />
          </div>
        </nav>
      </div>

      <MobileMoreNavSheet
        open={moreOpen}
        items={moreItems}
        pathname={pathname}
        t={t}
        isRtl={isRtl}
        onClose={() => setMoreOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
}
