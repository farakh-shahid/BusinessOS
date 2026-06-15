import {
  BarChart3,
  LayoutDashboard,
  Receipt,
  Scissors,
  Settings,
  Shirt,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { isAdminRole, isFloorRole } from "@/core/auth/roles";

export type NavLabelKey =
  | "dashboard"
  | "orders"
  | "customers"
  | "receivables"
  | "assignments"
  | "analytics"
  | "settings";

export interface NavItem {
  segment:
    | "dashboard"
    | "orders"
    | "customers"
    | "receivables"
    | "assignments"
    | "analytics"
    | "settings";
  icon: LucideIcon;
  labelKey: NavLabelKey;
  adminOnly?: boolean;
}

export const navItems: NavItem[] = [
  { segment: "dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { segment: "orders", icon: Shirt, labelKey: "orders" },
  { segment: "customers", icon: Users, labelKey: "customers" },
  { segment: "receivables", icon: Receipt, labelKey: "receivables" },
  { segment: "assignments", icon: Scissors, labelKey: "assignments" },
  {
    segment: "analytics",
    icon: BarChart3,
    labelKey: "analytics",
    adminOnly: true,
  },
  {
    segment: "settings",
    icon: Settings,
    labelKey: "settings",
    adminOnly: true,
  },
];

export const mobilePrimarySegments: NavItem["segment"][] = [
  "dashboard",
  "orders",
  "customers",
];

export function getMobilePrimaryNavItems(role?: string | null): NavItem[] {
  const visible = getVisibleNavItems(role);
  return mobilePrimarySegments
    .map((segment) => visible.find((item) => item.segment === segment))
    .filter((item): item is NavItem => item != null);
}

export function getMobileMoreNavItems(role?: string | null): NavItem[] {
  return getVisibleNavItems(role).filter(
    (item) => !mobilePrimarySegments.includes(item.segment),
  );
}

export function mobileNavLabel(labelKey: NavLabelKey, t: Dictionary): string {
  const shortKey: Partial<Record<NavLabelKey, keyof Dictionary["nav"]>> = {
    dashboard: "home",
    analytics: "stats",
    receivables: "receivablesShort",
    assignments: "assignmentsShort",
    settings: "settingsShort",
  };
  const key = shortKey[labelKey] ?? labelKey;
  return t.nav[key];
}

export function getVisibleNavItems(role?: string | null): NavItem[] {
  if (isFloorRole(role)) {
    return navItems.filter(
      (item) => item.segment === "dashboard" || item.segment === "orders",
    );
  }

  return navItems.filter(
    (item) => !item.adminOnly || isAdminRole(role),
  );
}

export function navPath(segment: NavItem["segment"]): string {
  if (segment === "dashboard") return routes.dashboard;
  if (segment === "customers") return routes.customers;
  if (segment === "receivables") return routes.receivables;
  if (segment === "assignments") return routes.assignments;
  if (segment === "analytics") return routes.analytics;
  if (segment === "settings") return routes.settings;
  return routes.orders;
}

export function isNavActive(pathname: string, segment: NavItem["segment"]) {
  const path = navPath(segment);
  return pathname === path || pathname.startsWith(`${path}/`);
}
