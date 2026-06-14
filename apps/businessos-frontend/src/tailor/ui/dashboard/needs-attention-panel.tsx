"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  ChevronRight,
  Clock,
  MessageCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import type {
  DashboardReadyPickupItem,
  NeedsAttentionItem,
  NeedsAttentionKind,
} from "@business-os/tailor";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";

interface NeedsAttentionPanelProps {
  items: NeedsAttentionItem[];
  readyForPickup: DashboardReadyPickupItem[];
  readyCount: number;
  t: Dictionary;
  isRtl?: boolean;
}

const AVATAR_COLORS = ["#2E9BE6", "#8B5CF6", "#12A36A", "#F4A828", "#E5484D"];

const itemConfig: Record<
  NeedsAttentionKind,
  {
    icon: LucideIcon;
    emoji?: string;
    countClass: string;
    iconWrapClass: string;
    filter: string;
  }
> = {
  rush: {
    icon: Zap,
    emoji: "⚡",
    countClass: "text-rose-600",
    iconWrapClass: "bg-rose-50 text-rose-500",
    filter: "priority",
  },
  overdue: {
    icon: AlertTriangle,
    emoji: "⚠️",
    countClass: "text-rose-600",
    iconWrapClass: "bg-rose-50 text-rose-500",
    filter: "overdue",
  },
  due_today: {
    icon: Clock,
    emoji: "⏰",
    countClass: "text-amber-600",
    iconWrapClass: "bg-amber-50 text-amber-600",
    filter: "due_today",
  },
  payment_due: {
    icon: Banknote,
    countClass: "text-emerald-700",
    iconWrapClass: "bg-emerald-50 text-emerald-600",
    filter: "payment_due",
  },
};

function itemTitle(kind: NeedsAttentionKind, t: Dictionary): string {
  switch (kind) {
    case "rush":
      return t.dashboard.needsAttention.rush;
    case "overdue":
      return t.dashboard.needsAttention.overdue;
    case "due_today":
      return t.dashboard.needsAttention.dueToday;
    case "payment_due":
      return t.dashboard.needsAttention.paymentDue;
  }
}

export function NeedsAttentionPanel({
  items,
  readyForPickup,
  readyCount,
  t,
  isRtl = false,
}: NeedsAttentionPanelProps) {
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <section
      className="flex min-w-0 flex-col rounded-2xl border border-hairline bg-card shadow-sm lg:h-full"
      aria-label={t.dashboard.needsAttention.title}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-4 sm:px-[17px]",
          isRtl && "flex-row-reverse",
        )}
      >
        <h2 className="font-display min-w-0 text-sm font-bold text-rose-600">
          ● {t.dashboard.needsAttention.title}
        </h2>
        <span className="shrink-0 text-[11px] text-muted-slate">
          {t.dashboard.needsAttention.itemCount.replace(
            "{count}",
            String(totalCount),
          )}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {items.length === 0 && readyForPickup.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-slate sm:px-[17px]">
            {t.dashboard.needsAttention.allClear}
          </p>
        ) : (
          <>
            {items.map((item) => {
              const config = itemConfig[item.kind];
              const href = routes.ordersWithFilter(config.filter);

              return (
                <Link
                  key={item.kind}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 border-b border-hairline px-4 py-2.5 transition hover:bg-slate-50/80 sm:gap-2.5 sm:px-[17px]",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <div
                    className={cn(
                      "grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] text-[13px]",
                      config.iconWrapClass,
                    )}
                  >
                    {config.emoji ?? <config.icon className="h-4 w-4" />}
                  </div>
                  <span
                    className={cn(
                      "font-display min-w-[18px] text-[17px] font-bold leading-none tabular-nums",
                      config.countClass,
                    )}
                  >
                    {item.count}
                  </span>
                  <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
                    <p className="text-[12.5px] font-semibold leading-snug text-foreground">
                      {itemTitle(item.kind, t)}
                    </p>
                    {item.detail ? (
                      <p className="line-clamp-2 text-[10.5px] leading-snug text-muted-slate sm:truncate">
                        {item.detail}
                      </p>
                    ) : null}
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-slate",
                      isRtl && "rotate-180",
                    )}
                  />
                </Link>
              );
            })}

            {readyForPickup.length > 0 ? (
              <>
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-slate sm:px-[17px]",
                    isRtl && "flex-row-reverse",
                  )}
                >
                  <span className="whitespace-nowrap">
                    {t.dashboard.needsAttention.readyForPickup} · {readyCount}
                  </span>
                  <span className="h-px flex-1 bg-hairline" />
                </div>

                {readyForPickup.map((pickup, index) => (
                  <div
                    key={pickup.orderId}
                    className={cn(
                      "flex flex-col gap-2.5 border-b border-hairline px-4 py-3 sm:flex-row sm:items-center sm:gap-2.5 sm:py-2 sm:px-[17px]",
                      isRtl && "sm:flex-row-reverse",
                    )}
                  >
                    <div
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-2.5",
                        isRtl && "flex-row-reverse",
                      )}
                    >
                      <div
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] font-display text-[10px] font-bold text-white"
                        style={{
                          background: AVATAR_COLORS[index % AVATAR_COLORS.length],
                        }}
                      >
                        {pickup.customerInitials}
                      </div>
                      <div className={cn("min-w-0 flex-1", isRtl && "text-right")}>
                        <p className="truncate text-xs font-semibold">
                          <PersonNameText name={pickup.customerName} />
                        </p>
                        <p className="line-clamp-2 text-[10.5px] leading-snug text-muted-slate sm:truncate">
                          {pickup.subtitle}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={routes.orderDetail(pickup.orderId)}
                      className={cn(
                        "inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-2 text-[10.5px] font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:w-auto sm:py-1.5",
                        isRtl && "flex-row-reverse",
                      )}
                    >
                      <MessageCircle className="h-3 w-3 shrink-0" />
                      {t.dashboard.needsAttention.remind}
                    </Link>
                  </div>
                ))}
              </>
            ) : null}
          </>
        )}

        <div className="flex-1" />

        {totalCount > 0 ? (
          <div className="p-3 sm:p-4">
            <Link
              href={routes.orders}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-[10px] bg-rose-50 px-4 py-2.5 text-[12.5px] font-semibold text-rose-600 transition hover:bg-rose-100",
                isRtl && "flex-row-reverse",
              )}
            >
              {t.dashboard.needsAttention.reviewAll.replace(
                "{count}",
                String(totalCount),
              )}
              <ArrowRight
                className={cn("h-4 w-4", isRtl && "rotate-180")}
                strokeWidth={2.5}
              />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
