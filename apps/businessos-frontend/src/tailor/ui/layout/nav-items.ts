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
import { routes } from "@/core/config/routes";
import { isAdminRole } from "@/core/auth/roles";

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
  },
];

export function getVisibleNavItems(role?: string | null): NavItem[] {
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
