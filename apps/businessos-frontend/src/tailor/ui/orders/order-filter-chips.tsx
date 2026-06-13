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
    idle: "border-red-300 bg-red-50 text-red-900 hover:bg-red-100",
    active: "border-red-600 bg-red-600 text-white shadow-md shadow-red-600/25",
    iconBox: "bg-red-100 text-red-700",
    iconBoxActive: "bg-white/20 text-white",
  },
  due_today: {
    icon: CalendarClock,
    idle: "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
    active: "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/25",
    iconBox: "bg-amber-100 text-amber-700",
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
    idle: "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100",
    active: "border-rose-600 bg-rose-600 text-white shadow-md shadow-rose-600/25",
    iconBox: "bg-rose-100 text-rose-700",
    iconBoxActive: "bg-white/20 text-white",
  },
  pending: {
    icon: Clock,
    idle: "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200",
    active: "border-slate-600 bg-slate-600 text-white shadow-md shadow-slate-600/25",
    iconBox: "bg-slate-200 text-slate-700",
    iconBoxActive: "bg-white/20 text-white",
  },
  cutting: {
    icon: Scissors,
    idle: "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100",
    active: "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/25",
    iconBox: "bg-amber-100 text-amber-700",
    iconBoxActive: "bg-white/20 text-white",
  },
  stitching: {
    icon: Shirt,
    idle: "border-orange-300 bg-orange-50 text-orange-900 hover:bg-orange-100",
    active:
      "border-orange-600 bg-orange-600 text-white shadow-md shadow-orange-600/25",
    iconBox: "bg-orange-100 text-orange-700",
    iconBoxActive: "bg-white/20 text-white",
  },
  ready: {
    icon: CheckCircle2,
    idle: "border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100",
    active: "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25",
    iconBox: "bg-blue-100 text-blue-700",
    iconBoxActive: "bg-white/20 text-white",
  },
  delivered: {
    icon: Truck,
    idle: "border-green-300 bg-green-50 text-green-900 hover:bg-green-100",
    active:
      "border-green-600 bg-green-600 text-white shadow-md shadow-green-600/25",
    iconBox: "bg-green-100 text-green-700",
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
