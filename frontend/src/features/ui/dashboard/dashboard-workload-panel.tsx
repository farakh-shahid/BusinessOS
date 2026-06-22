"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { DashboardWorkload, DashboardWorkloadStage } from "@shared";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";

interface DashboardWorkloadPanelProps {
  workload: DashboardWorkload;
  t: Dictionary;
  isRtl?: boolean;
}

const stageConfig: Record<
  DashboardWorkloadStage | "ready",
  {
    filter: string;
    blockClass: string;
    labelKey: "booked" | "cutting" | "stitching" | "ready";
  }
> = {
  booked: {
    filter: "pending",
    blockClass: "bg-status-booked",
    labelKey: "booked",
  },
  cutting: {
    filter: "cutting",
    blockClass: "bg-status-cutting",
    labelKey: "cutting",
  },
  stitching: {
    filter: "stitching",
    blockClass: "bg-status-stitching",
    labelKey: "stitching",
  },
  ready: {
    filter: "ready_not_delivered",
    blockClass: "bg-status-ready",
    labelKey: "ready",
  },
};

function bottleneckLabel(
  stage: DashboardWorkloadStage,
  t: Dictionary,
): string {
  switch (stage) {
    case "booked":
      return t.dashboard.workload.booked;
    case "cutting":
      return t.dashboard.workload.cutting;
    case "stitching":
      return t.dashboard.workload.stitching;
  }
}

export function DashboardWorkloadPanel({
  workload,
  t,
  isRtl = false,
}: DashboardWorkloadPanelProps) {
  const stages = (
    ["booked", "cutting", "stitching", "ready"] as const
  ).map((key) => ({
    key,
    count: workload[key],
    ...stageConfig[key],
  }));

  const bottleneckCount = workload[workload.bottleneck];

  return (
    <section className="min-w-0 rounded-2xl border border-hairline bg-card shadow-sm">
      <div
        className={cn(
          "flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-[17px]",
          isRtl && "sm:flex-row-reverse",
        )}
      >
        <div className={cn("min-w-0", isRtl && "text-right")}>
          <h2 className="font-display text-sm font-bold text-foreground">
            {t.dashboard.workload.title}
          </h2>
          <p className="mt-0.5 text-[11px] font-medium text-muted-slate">
            {t.dashboard.workload.subtitle}
          </p>
        </div>
        <Link
          href={routes.assignments}
          className={cn(
            "inline-flex shrink-0 items-center gap-0.5 self-start text-[11.5px] font-semibold text-accent-500 transition hover:text-accent-600 sm:self-center",
            isRtl && "flex-row-reverse self-end sm:self-center",
          )}
        >
          {t.dashboard.workload.openBoard}
          <ChevronRight
            className={cn("h-3.5 w-3.5", isRtl && "rotate-180")}
            strokeWidth={2.5}
          />
        </Link>
      </div>

      <div className="px-4 pb-4 sm:px-[17px]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stages.map((stage) => (
            <div
              key={stage.key}
              className={cn(
                "relative flex min-h-[4.75rem] flex-col items-center justify-center rounded-xl px-2 py-3 text-center text-white",
                stage.blockClass,
              )}
            >
              <Link
                href={routes.ordersWithFilter(stage.filter)}
                className="absolute inset-0 rounded-xl transition hover:brightness-105 active:scale-[0.98]"
                aria-label={`${t.dashboard.workload[stage.labelKey]} ${stage.count}`}
              />
              <span className="pointer-events-none relative font-display text-[1.25rem] font-bold leading-none sm:text-[1.375rem]">
                {stage.count}
              </span>
              <span className="pointer-events-none relative mt-1.5 text-[10px] font-semibold leading-tight opacity-95">
                {t.dashboard.workload[stage.labelKey]}
              </span>
              {stage.key === "ready" && stage.count > 0 ? (
                <span className="pointer-events-none relative mt-1 rounded-full bg-white/25 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide">
                  {t.dashboard.workload.pickup}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {workload.bookedToday > 0 ? (
          <div className={cn("mt-2.5", isRtl && "text-right")}>
            <Link
              href={routes.ordersWithFilter("booked_today")}
              className="inline-flex rounded-lg bg-status-booked-bg px-2.5 py-1 text-[10.5px] font-semibold text-status-booked transition hover:brightness-95"
            >
              {t.dashboard.workload.bookedToday.replace(
                "{count}",
                String(workload.bookedToday),
              )}
            </Link>
          </div>
        ) : null}

        {bottleneckCount > 0 || workload.ready > 0 ? (
          <p
            className={cn(
              "mt-2.5 text-[11.5px] leading-relaxed text-muted-slate",
              isRtl && "text-right",
            )}
          >
            {bottleneckCount > 0 ? (
              <>
                ⚠️{" "}
                <strong className="font-semibold text-foreground">
                  {bottleneckLabel(workload.bottleneck, t)}
                </strong>{" "}
                {t.dashboard.workload.bottleneckHint.replace(
                  "{count}",
                  String(bottleneckCount),
                )}
              </>
            ) : (
              t.dashboard.workload.noBottleneck
            )}
            {workload.ready > 0
              ? ` · ${t.dashboard.workload.readyPickup.replace(
                  "{count}",
                  String(workload.ready),
                )}`
              : null}
          </p>
        ) : null}
      </div>
    </section>
  );
}
