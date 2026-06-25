"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { BottomSheet } from "@/core/presentation/components/ui/bottom-sheet";
import type { OrderListFilter } from "@/features/infrastructure/data/order-filters";
import type {
  OrderListParams,
  OrderListSort,
} from "@/features/infrastructure/data/order-list-params";
import { defaultOrderListParams } from "@/features/infrastructure/data/order-list-params";

const BOOKING_FILTERS: OrderListFilter[] = [
  "",
  "booked_today",
  "booked_last_week",
];

const STATUS_FILTERS: OrderListFilter[] = [
  "pending",
  "cutting",
  "stitching",
  "ready",
  "ready_not_delivered",
  "delivered",
  "cancelled",
  "in_progress",
];

const URGENCY_FILTERS: OrderListFilter[] = [
  "overdue",
  "due_today",
  "due_tomorrow",
  "due_this_week",
  "priority",
  "payment_due",
];

const SORT_OPTIONS: OrderListSort[] = [
  "workflow",
  "newest",
  "due_asc",
  "due_desc",
  "priority",
  "booking_desc",
  "booking_asc",
];

interface OrderFiltersSheetProps {
  open: boolean;
  params: OrderListParams;
  t: Dictionary;
  isRtl: boolean;
  onClose: () => void;
  onApply: (next: OrderListParams) => void;
}

function FilterOption({
  label,
  selected,
  onSelect,
  isRtl,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  isRtl?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
        isRtl && "flex-row-reverse text-right",
        selected
          ? "border-brand-700 bg-brand-50 text-brand-900"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold",
          selected
            ? "border-brand-700 bg-brand-700 text-white"
            : "border-slate-300 bg-white text-transparent",
        )}
      >
        ✓
      </span>
      {label}
    </button>
  );
}

function SectionTitle({
  title,
  isRtl,
}: {
  title: string;
  isRtl?: boolean;
}) {
  return (
    <p
      className={cn(
        "mb-2 text-xs font-bold uppercase tracking-wide text-slate-400",
        isRtl && "text-right",
      )}
    >
      {title}
    </p>
  );
}

export function OrderFiltersSheet({
  open,
  params,
  t,
  isRtl,
  onClose,
  onApply,
}: OrderFiltersSheetProps) {
  const [draft, setDraft] = useState<OrderListParams>(params);

  useEffect(() => {
    if (open) {
      setDraft(params);
    }
  }, [open, params]);

  function setFilter(filter: OrderListFilter) {
    setDraft((prev) => ({
      ...prev,
      filter,
      dueFrom: filter === "due_this_week" ? "" : prev.dueFrom,
      dueTo: filter === "due_this_week" ? "" : prev.dueTo,
    }));
  }

  function filterLabel(key: OrderListFilter): string {
    if (key === "") return t.orderFilters.all;
    return t.orderFilters[key as Exclude<OrderListFilter, "">];
  }

  function sortLabel(sort: OrderListSort): string {
    const map: Record<OrderListSort, keyof Dictionary["orderList"]> = {
      workflow: "sortWorkflow",
      newest: "sortNewest",
      due_asc: "sortDueAsc",
      due_desc: "sortDueDesc",
      priority: "sortPriority",
      booking_desc: "sortBookingDesc",
      booking_asc: "sortBookingAsc",
    };
    return t.orderList[map[sort]];
  }

  function handleReset() {
    const cleared: OrderListParams = {
      ...defaultOrderListParams(),
      search: params.search,
      assignedTo: params.assignedTo,
    };
    setDraft(cleared);
    onApply(cleared);
    onClose();
  }

  return (
    <BottomSheet
      open={open}
      title={t.orderList.filtersTitle}
      onClose={onClose}
      isRtl={isRtl}
      footer={
        <div className={cn("flex flex-col gap-2 sm:flex-row", isRtl && "sm:flex-row-reverse")}>
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex-1"
          >
            {t.orderList.resetFilters}
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="w-full rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white hover:bg-brand-800 sm:flex-[2]"
          >
            {t.orderList.applyFilters}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <section>
          <SectionTitle title={t.orderList.bookingSection} isRtl={isRtl} />
          <div className="space-y-2">
            {BOOKING_FILTERS.map((key) => (
              <FilterOption
                key={key || "all-bookings"}
                label={filterLabel(key)}
                selected={draft.filter === key}
                onSelect={() => setFilter(key)}
                isRtl={isRtl}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={t.orderList.statusSection} isRtl={isRtl} />
          <div className="space-y-2">
            {STATUS_FILTERS.map((key) => (
              <FilterOption
                key={key}
                label={filterLabel(key)}
                selected={draft.filter === key}
                onSelect={() => setFilter(key)}
                isRtl={isRtl}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={t.orderList.urgencySection} isRtl={isRtl} />
          <div className="space-y-2">
            {URGENCY_FILTERS.map((key) => (
              <FilterOption
                key={key}
                label={filterLabel(key)}
                selected={draft.filter === key}
                onSelect={() => setFilter(key)}
                isRtl={isRtl}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={t.orderList.sortSection} isRtl={isRtl} />
          <div className="space-y-2">
            {SORT_OPTIONS.map((sort) => (
              <FilterOption
                key={sort}
                label={sortLabel(sort)}
                selected={draft.sort === sort}
                onSelect={() => setDraft((prev) => ({ ...prev, sort }))}
                isRtl={isRtl}
              />
            ))}
          </div>
        </section>
      </div>
    </BottomSheet>
  );
}
