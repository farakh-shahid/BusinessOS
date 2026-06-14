"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

export interface HeroStatusItem {
  value: number;
  label: string;
}

interface ShopHeroProps {
  eyebrow: string;
  title: string;
  dateLabel?: string;
  badge?: string;
  /** Decorative icon on the default variant only. */
  icon?: LucideIcon;
  isRtl?: boolean;
  className?: string;
  variant?: "default" | "dashboard";
  statusItems?: HeroStatusItem[];
  /** Dashboard hero: in-production + need-attention counts in one meta line. */
  dashboardSummary?: {
    inProduction: number;
    needAttention: number;
  };
  inProductionLabel?: string;
  needAttentionLabel?: string;
  newOrderLabel?: string;
  newOrderHref?: string;
}

export function ShopHero({
  eyebrow,
  title,
  dateLabel,
  badge,
  icon: Icon,
  isRtl = false,
  className,
  variant = "default",
  statusItems,
  dashboardSummary,
  inProductionLabel,
  needAttentionLabel,
  newOrderLabel,
  newOrderHref,
}: ShopHeroProps) {
  const isDashboard = variant === "dashboard";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[18px] bg-sidebar shadow-lg shadow-sidebar-dark/20",
        !isDashboard &&
          "bg-gradient-to-br from-sidebar via-sidebar-light to-sidebar-dark",
        className,
      )}
    >
      {!isDashboard ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.12) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-accent-500/10" />
          <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-accent-500/5" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent" />
        </>
      ) : null}

      {/* Corner orange accent — kept on all variants */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/10" />

      {isDashboard ? (
        <div
          className={cn(
            "relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-8",
            isRtl && "sm:flex-row-reverse",
          )}
        >
          <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
            <p className="text-sm font-medium text-sidebar-text-muted">{eyebrow}</p>
            <h1 className="font-display mt-1 text-[1.625rem] font-bold leading-tight tracking-tight text-white sm:text-[1.75rem]">
              {title}
            </h1>
            {dateLabel && dashboardSummary ? (
              <p
                className={cn(
                  "mt-2.5 text-[12.5px] leading-relaxed text-sidebar-text-muted",
                  isRtl && "text-right",
                )}
              >
                <span className="block sm:inline">{dateLabel}</span>
                <span className="hidden sm:inline"> · </span>
                <span className="mt-1 block sm:mt-0 sm:inline">
                  <strong className="font-bold text-white">
                    {dashboardSummary.inProduction}
                  </strong>{" "}
                  {inProductionLabel} ·{" "}
                  <strong className="font-bold text-white">
                    {dashboardSummary.needAttention}
                  </strong>{" "}
                  {needAttentionLabel}
                </span>
              </p>
            ) : dateLabel && statusItems?.length ? (
              <p
                className={cn(
                  "mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-sidebar-text-muted",
                  isRtl && "flex-row-reverse justify-end",
                )}
              >
                <span>{dateLabel}</span>
                {statusItems.map((item) => (
                  <span key={item.label} className="whitespace-nowrap">
                    <strong className="font-bold text-white">{item.value}</strong>{" "}
                    {item.label}
                  </span>
                ))}
              </p>
            ) : dateLabel ? (
              <p className="mt-2.5 text-sm text-sidebar-text-muted">{dateLabel}</p>
            ) : null}
          </div>

          {newOrderHref && newOrderLabel ? (
            <Link
              href={newOrderHref}
              className={cn(
                "inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-accent-500/25 transition hover:brightness-105 active:scale-[0.98] sm:w-auto sm:px-6",
                isRtl && "flex-row-reverse",
              )}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              {newOrderLabel}
            </Link>
          ) : null}
        </div>
      ) : (
        <div
          className={cn(
            "relative flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-8",
            isRtl && "sm:flex-row-reverse",
          )}
        >
          <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
            {badge ? (
              <span className="mb-3 inline-flex rounded-full border border-accent-400/30 bg-accent-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent-200">
                {badge}
              </span>
            ) : null}
            <p className="text-sm font-medium text-sidebar-text-muted">{eyebrow}</p>
            <h1 className="font-display mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
            {dateLabel ? (
              <p className="mt-2 text-xs font-medium text-sidebar-text/70 sm:text-sm">
                {dateLabel}
              </p>
            ) : null}
          </div>

          {newOrderHref && newOrderLabel ? (
            <Link
              href={newOrderHref}
              className={cn(
                "inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 self-start rounded-2xl bg-accent-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-accent-500/25 transition hover:brightness-105 active:scale-[0.98] sm:w-auto sm:px-6",
                isRtl && "flex-row-reverse",
              )}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              {newOrderLabel}
            </Link>
          ) : Icon ? (
            <div
              className={cn(
                "hidden h-14 w-14 shrink-0 items-center justify-center self-start rounded-2xl border border-white/10 bg-white/5 shadow-inner backdrop-blur-sm sm:flex",
                isRtl && "order-first",
              )}
            >
              <Icon className="h-7 w-7 text-white/75" strokeWidth={1.5} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
