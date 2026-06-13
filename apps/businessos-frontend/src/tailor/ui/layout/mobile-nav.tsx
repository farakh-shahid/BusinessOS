"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Home,
  Plus,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { isAdminRole } from "@/core/auth/roles";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { isNavActive, navPath, type NavItem } from "./nav-items";

type MobileTabLabelKey = "home" | "orders" | "clients" | "stats" | "settings";

interface MobileTab {
  segment: NavItem["segment"];
  icon: LucideIcon;
  labelKey: MobileTabLabelKey;
}

function getMobileTabs(role?: string | null): {
  left: MobileTab[];
  right: MobileTab[];
} {
  const fourth: MobileTab = isAdminRole(role)
    ? { segment: "analytics", icon: BarChart3, labelKey: "stats" }
    : { segment: "settings", icon: Settings, labelKey: "settings" };

  return {
    left: [
      { segment: "dashboard", icon: Home, labelKey: "home" },
      { segment: "orders", icon: ClipboardList, labelKey: "orders" },
    ],
    right: [
      { segment: "customers", icon: Users, labelKey: "clients" },
      fourth,
    ],
  };
}

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

export function MobileNav() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const { data: user } = useMeQuery();
  const { left, right } = getMobileTabs(user?.role);

  function tabLabel(key: MobileTabLabelKey): string {
    return t.nav[key];
  }

  return (
    <div className="mobile-nav-shell pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden">
      <nav
        className="mobile-nav-dock pointer-events-auto mx-auto max-w-lg"
        aria-label="Main navigation"
      >
        <div className="mobile-nav-dock-inner grid grid-cols-5 items-end px-2 pb-2 pt-2.5">
          {left.map(({ segment, icon, labelKey }) => (
            <MobileBottomNavLink
              key={segment}
              href={navPath(segment)}
              label={tabLabel(labelKey)}
              icon={icon}
              active={isNavActive(pathname, segment)}
            />
          ))}

          <div className="flex justify-center pb-1">
            <Link
              href={routes.newOrder}
              aria-label={t.nav.newOrder}
              className="-mt-7 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-accent-500 text-white shadow-[0_8px_24px_rgba(255,106,43,0.45),0_2px_6px_rgba(14,26,54,0.12)] ring-[3px] ring-white/80 transition hover:brightness-105 active:scale-95"
            >
              <Plus className="h-7 w-7" strokeWidth={2.5} />
            </Link>
          </div>

          {right.map(({ segment, icon, labelKey }) => (
            <MobileBottomNavLink
              key={segment}
              href={navPath(segment)}
              label={tabLabel(labelKey)}
              icon={icon}
              active={isNavActive(pathname, segment)}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
