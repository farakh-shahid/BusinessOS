"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

interface ShopHeroProps {
  eyebrow: string;
  title: string;
  dateLabel?: string;
  badge?: string;
  icon: LucideIcon;
  isRtl?: boolean;
  className?: string;
}

export function ShopHero({
  eyebrow,
  title,
  dateLabel,
  badge,
  icon: Icon,
  isRtl = false,
  className,
}: ShopHeroProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br from-sidebar via-[#002a52] to-sidebar-dark shadow-lg shadow-sidebar-dark/20",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.12) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent" />

      <div
        className={cn(
          "relative flex items-start justify-between gap-4 p-6 sm:p-8",
          isRtl && "flex-row-reverse",
        )}
      >
        <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
          {badge ? (
            <span className="mb-3 inline-flex rounded-full border border-accent-400/30 bg-accent-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent-200">
              {badge}
            </span>
          ) : null}
          <p className="text-sm font-medium text-sidebar-text-muted">{eyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {dateLabel ? (
            <p className="mt-2 text-xs font-medium text-sidebar-text/70 sm:text-sm">
              {dateLabel}
            </p>
          ) : null}
        </div>

        <div
          className={cn(
            "hidden shrink-0 sm:flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-inner backdrop-blur-sm",
            isRtl && "order-first",
          )}
        >
          <Icon className="h-7 w-7 text-white/75" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
