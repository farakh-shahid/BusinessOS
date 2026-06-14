"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import type { DashboardGarmentMix } from "@business-os/tailor";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";

interface DashboardGarmentMixPanelProps {
  mix: DashboardGarmentMix;
  t: Dictionary;
  isRtl?: boolean;
}

const SEGMENT_COLORS = [
  "var(--color-accent-500)",
  "var(--color-status-stitching)",
  "var(--color-status-booked)",
  "var(--color-status-cutting)",
  "var(--color-muted-slate)",
] as const;

function GarmentDonut({
  total,
  items,
  ordersLabel,
}: {
  total: number;
  items: DashboardGarmentMix["items"];
  ordersLabel: string;
}) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const arcs = items.map((item, index) => {
    const length = (circumference * item.percent) / 100;
    const arc = (
      <circle
        key={item.garmentType}
        cx="42"
        cy="42"
        r={radius}
        fill="none"
        stroke={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
        strokeWidth="15"
        strokeDasharray={`${length} ${circumference - length}`}
        strokeDashoffset={-offset}
        transform="rotate(-90 42 42)"
      />
    );
    offset += length;
    return arc;
  });

  return (
    <svg width="100" height="100" viewBox="0 0 84 84" aria-hidden>
      {arcs}
      <text
        x="42"
        y="40"
        textAnchor="middle"
        className="fill-foreground font-display text-[13px] font-bold"
      >
        {total}
      </text>
      <text
        x="42"
        y="52"
        textAnchor="middle"
        className="fill-muted-slate text-[7px]"
      >
        {ordersLabel}
      </text>
    </svg>
  );
}

export function DashboardGarmentMixPanel({
  mix,
  t,
  isRtl = false,
}: DashboardGarmentMixPanelProps) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-hairline bg-card shadow-sm">
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-4 sm:px-[17px]",
          isRtl && "flex-row-reverse",
        )}
      >
        <h2 className="font-display text-sm font-bold text-foreground">
          {t.dashboard.garmentMix.title}
        </h2>
        <Link
          href={routes.analytics}
          className={cn(
            "inline-flex shrink-0 items-center gap-0.5 text-[11.5px] font-semibold text-accent-500 transition hover:text-accent-600",
            isRtl && "flex-row-reverse",
          )}
        >
          {t.dashboard.garmentMix.range}
          <ChevronRight
            className={cn("h-3.5 w-3.5", isRtl && "rotate-180")}
            strokeWidth={2.5}
          />
        </Link>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-wrap items-center gap-3 px-4 pb-4 sm:px-[17px]",
          isRtl && "flex-row-reverse",
        )}
      >
        <GarmentDonut
          total={mix.totalOrders}
          items={mix.items}
          ordersLabel={t.dashboard.garmentMix.orders}
        />
        <div className="min-w-[96px] flex-1 space-y-1.5 text-[11px]">
          {mix.items.map((item, index) => (
            <div
              key={item.garmentType}
              className={cn(
                "flex items-center gap-1.5",
                isRtl && "flex-row-reverse",
              )}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-sm"
                style={{
                  background: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                }}
              />
              <span className="min-w-0 flex-1 truncate">
                {item.garmentLabel === "Other"
                  ? t.dashboard.garmentMix.other
                  : item.garmentLabel}
              </span>
              <b className="font-display shrink-0">{item.percent}%</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
