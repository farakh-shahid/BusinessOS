"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

interface SidebarNavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  isRtl?: boolean;
}

export function SidebarNavLink({
  href,
  label,
  icon: Icon,
  active,
  isRtl,
}: SidebarNavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
        active
          ? "bg-white text-sidebar shadow-lg shadow-black/10"
          : "text-sidebar-text/90 hover:bg-white/10 hover:text-white",
        isRtl && "flex-row-reverse",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
          active
            ? "bg-gradient-to-br from-sidebar-light to-sidebar-dark text-white"
            : "bg-white/10 text-sidebar-text group-hover:bg-white/15",
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.5 : 2} />
      </span>
      <span className="truncate">{label}</span>
      {active && (
        <span
          className={cn(
            "absolute top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-accent-500",
            isRtl ? "-right-1" : "-left-1",
          )}
        />
      )}
    </Link>
  );
}

interface MobileNavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}

export function MobileNavLink({
  href,
  label,
  icon: Icon,
  active,
}: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-w-[4.25rem] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 transition-all duration-200",
        active
          ? "bg-sidebar/5 text-sidebar shadow-sm"
          : "text-slate-400 hover:text-sidebar",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
          active
            ? "bg-gradient-to-br from-sidebar to-sidebar-dark text-white shadow-sm"
            : "bg-transparent",
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.5 : 2} />
      </span>
      <span className="max-w-full truncate text-[10px] font-bold leading-tight">
        {label}
      </span>
      {active && (
        <span className="h-1 w-1 rounded-full bg-accent-500" aria-hidden />
      )}
    </Link>
  );
}
