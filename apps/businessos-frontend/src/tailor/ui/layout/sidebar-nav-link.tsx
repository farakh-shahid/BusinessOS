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
        "sidebar-nav-link group flex items-center gap-3 rounded-2xl text-sm font-semibold transition-all duration-200",
        active
          ? "sidebar-nav-glass px-4 py-3.5 text-white"
          : "px-3 py-3 text-sidebar-text-muted hover:bg-white/[0.05] hover:text-white/90",
        isRtl && "flex-row-reverse",
      )}
    >
      {active ? (
        <span
          className="relative z-[1] h-8 w-1.5 shrink-0 rounded-full bg-accent-500 shadow-[0_0_12px_rgba(255,106,43,0.45)]"
          aria-hidden
        />
      ) : (
        <Icon
          className="relative z-[1] h-[18px] w-[18px] shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
          strokeWidth={2}
        />
      )}
      <span className="relative z-[1] truncate">{label}</span>
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
        "flex min-w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-2.5 py-2 transition-all duration-200",
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
      <span className="whitespace-nowrap text-[10px] font-bold leading-tight">
        {label}
      </span>
      {active && (
        <span className="h-1 w-1 rounded-full bg-accent-500" aria-hidden />
      )}
    </Link>
  );
}
