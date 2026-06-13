"use client";

import {
  AlertTriangle,
  Ban,
  CalendarClock,
  CheckCircle2,
  Clock,
  LayoutGrid,
  PackageOpen,
  Scissors,
  Shirt,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import {
  orderFilterOptions,
  type OrderListFilter,
} from "@/tailor/infrastructure/data/order-filters";

interface FilterChipStyle {
  icon: LucideIcon;
  idle: string;
  active: string;
  iconBox: string;
  iconBoxActive: string;
}

const filterChipStyles: Record<OrderListFilter, FilterChipStyle> = {
  "": {
    icon: LayoutGrid,
    idle: "border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100",
    active: "border-brand-700 bg-brand-700 text-white shadow-md shadow-brand-700/25",
    iconBox: "bg-brand-100 text-brand-700",
    iconBoxActive: "bg-white/20 text-white",
  },
  ready_not_delivered: {
    icon: PackageOpen,
    idle: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
    active:
      "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/25",
    iconBox: "bg-emerald-100 text-emerald-700",
    iconBoxActive: "bg-white/20 text-white",
  },
  overdue: {
    icon: AlertTriangle,
    idle: "border-status-urgent/40 bg-status-urgent-bg text-status-urgent hover:bg-status-urgent-bg",
    active:
      "border-status-urgent bg-status-urgent text-white shadow-md shadow-status-urgent/25",
    iconBox: "bg-status-urgent-bg text-status-urgent",
    iconBoxActive: "bg-white/20 text-white",
  },
  due_today: {
    icon: CalendarClock,
    idle: "border-status-urgent/40 bg-status-urgent-bg text-status-urgent hover:bg-status-urgent-bg",
    active:
      "border-status-urgent bg-status-urgent text-white shadow-md shadow-status-urgent/25",
    iconBox: "bg-status-urgent-bg text-status-urgent",
    iconBoxActive: "bg-white/20 text-white",
  },
  due_this_week: {
    icon: CalendarClock,
    idle: "border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100",
    active: "border-sky-600 bg-sky-600 text-white shadow-md shadow-sky-600/25",
    iconBox: "bg-sky-100 text-sky-700",
    iconBoxActive: "bg-white/20 text-white",
  },
  in_progress: {
    icon: Scissors,
    idle: "border-orange-300 bg-orange-50 text-orange-900 hover:bg-orange-100",
    active:
      "border-orange-600 bg-orange-600 text-white shadow-md shadow-orange-600/25",
    iconBox: "bg-orange-100 text-orange-700",
    iconBoxActive: "bg-white/20 text-white",
  },
  priority: {
    icon: Zap,
    idle: "border-status-urgent/40 bg-status-urgent-bg text-status-urgent hover:bg-status-urgent-bg",
    active:
      "border-status-urgent bg-status-urgent text-white shadow-md shadow-status-urgent/25",
    iconBox: "bg-status-urgent-bg text-status-urgent",
    iconBoxActive: "bg-white/20 text-white",
  },
  pending: {
    icon: Clock,
    idle: "border-status-booked/40 bg-status-booked-bg text-status-booked hover:bg-status-booked-bg",
    active:
      "border-status-booked bg-status-booked text-white shadow-md shadow-status-booked/25",
    iconBox: "bg-status-booked-bg text-status-booked",
    iconBoxActive: "bg-white/20 text-white",
  },
  cutting: {
    icon: Scissors,
    idle: "border-status-cutting/40 bg-status-cutting-bg text-[#9A6800] hover:bg-status-cutting-bg",
    active:
      "border-status-cutting bg-status-cutting text-white shadow-md shadow-status-cutting/25",
    iconBox: "bg-status-cutting-bg text-[#9A6800]",
    iconBoxActive: "bg-white/20 text-white",
  },
  stitching: {
    icon: Shirt,
    idle: "border-status-stitching/40 bg-status-stitching-bg text-status-stitching hover:bg-status-stitching-bg",
    active:
      "border-status-stitching bg-status-stitching text-white shadow-md shadow-status-stitching/25",
    iconBox: "bg-status-stitching-bg text-status-stitching",
    iconBoxActive: "bg-white/20 text-white",
  },
  ready: {
    icon: CheckCircle2,
    idle: "border-status-ready/40 bg-status-ready-bg text-status-ready hover:bg-status-ready-bg",
    active:
      "border-status-ready bg-status-ready text-white shadow-md shadow-status-ready/25",
    iconBox: "bg-status-ready-bg text-status-ready",
    iconBoxActive: "bg-white/20 text-white",
  },
  delivered: {
    icon: Truck,
    idle: "border-status-delivered/40 bg-status-delivered-bg text-status-delivered hover:bg-status-delivered-bg",
    active:
      "border-status-delivered bg-status-delivered text-white shadow-md shadow-status-delivered/25",
    iconBox: "bg-status-delivered-bg text-status-delivered",
    iconBoxActive: "bg-white/20 text-white",
  },
  cancelled: {
    icon: Ban,
    idle: "border-red-200 bg-red-50 text-red-800 hover:bg-red-100",
    active: "border-red-600 bg-red-600 text-white shadow-md shadow-red-600/25",
    iconBox: "bg-red-100 text-red-700",
    iconBoxActive: "bg-white/20 text-white",
  },
};

interface OrderFilterChipsProps {
  value: OrderListFilter;
  onChange: (value: OrderListFilter) => void;
}

export function OrderFilterChips({ value, onChange }: OrderFilterChipsProps) {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  return (
    <div
      className={cn(
        "flex flex-nowrap gap-2",
        isRtl && "flex-row-reverse",
      )}
    >
      {orderFilterOptions.map((filterKey) => {
        const label =
          filterKey === ""
            ? t.orderFilters.all
            : t.orderFilters[filterKey as Exclude<OrderListFilter, "">];
        const active = value === filterKey;
        const style = filterChipStyles[filterKey];
        const Icon = style.icon;

        return (
          <button
            key={filterKey || "all"}
            type="button"
            onClick={() => onChange(filterKey)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-2 py-1.5 text-xs font-semibold transition-all active:scale-[0.98]",
              isRtl && "flex-row-reverse",
              active ? style.active : style.idle,
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                active ? style.iconBoxActive : style.iconBox,
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
            <span className="pr-0.5">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
