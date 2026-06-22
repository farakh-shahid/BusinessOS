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
  compact?: boolean;
}

export function SidebarNavLink({
  href,
  label,
  icon: Icon,
  active,
  isRtl,
  compact = false,
}: SidebarNavLinkProps) {
  return (
    <Link
      href={href}
      title={compact ? label : undefined}
      aria-label={compact ? label : undefined}
      className={cn(
        "sidebar-nav-link group flex items-center rounded-2xl text-sm font-semibold transition-all duration-200",
        compact ? "justify-center px-2 py-3" : "gap-3",
        active
          ? cn(
              "sidebar-nav-glass text-white",
              compact ? "px-2 py-3" : "px-4 py-3.5",
            )
          : compact
            ? "px-2 py-3 text-sidebar-text-muted hover:bg-white/[0.05] hover:text-white/90"
            : "px-3 py-3 text-sidebar-text-muted hover:bg-white/[0.05] hover:text-white/90",
        isRtl && !compact && "flex-row-reverse",
      )}
    >
      {active && !compact ? (
        <span
          className="relative z-[1] h-8 w-1.5 shrink-0 rounded-full bg-accent-500 shadow-[0_0_12px_rgba(255,106,43,0.45)]"
          aria-hidden
        />
      ) : (
        <Icon
          className={cn(
            "relative z-[1] h-[18px] w-[18px] shrink-0 transition-opacity",
            active
              ? "text-accent-400 opacity-100"
              : "opacity-70 group-hover:opacity-100",
          )}
          strokeWidth={active ? 2.5 : 2}
        />
      )}
      {!compact ? (
        <span className="relative z-[1] truncate">{label}</span>
      ) : null}
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
