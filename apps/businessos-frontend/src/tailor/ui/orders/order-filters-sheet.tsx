"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { BottomSheet } from "@/core/presentation/components/ui/bottom-sheet";
import { Input } from "@/core/presentation/components/ui/input";
import type { OrderListFilter } from "@/tailor/infrastructure/data/order-filters";
import type {
  OrderListParams,
  OrderListSort,
} from "@/tailor/infrastructure/data/order-list-params";
import { defaultOrderListParams } from "@/tailor/infrastructure/data/order-list-params";

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
  "due_this_week",
  "priority",
];

const SORT_OPTIONS: OrderListSort[] = [
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
  const [dateOpen, setDateOpen] = useState(
    () => Boolean(params.dueFrom || params.dueTo),
  );

  useEffect(() => {
    if (open) {
      setDraft(params);
      setDateOpen(Boolean(params.dueFrom || params.dueTo));
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
    setDateOpen(false);
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
        <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t.orderList.resetFilters}
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="flex-[2] rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white hover:bg-brand-800"
          >
            {t.orderList.applyFilters}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <section>
          <SectionTitle title={t.orderList.statusSection} isRtl={isRtl} />
          <div className="space-y-2">
            <FilterOption
              label={filterLabel("")}
              selected={draft.filter === ""}
              onSelect={() => setFilter("")}
              isRtl={isRtl}
            />
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

        <section>
          <button
            type="button"
            onClick={() => setDateOpen((v) => !v)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800",
              isRtl && "flex-row-reverse",
            )}
          >
            <span className={cn("flex items-center gap-2", isRtl && "flex-row-reverse")}>
              <CalendarDays className="h-4 w-4 text-slate-500" />
              {t.orderList.dateRange}
              {draft.dueFrom || draft.dueTo ? (
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-800">
                  {t.orderList.active}
                </span>
              ) : null}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform",
                dateOpen && "rotate-180",
              )}
            />
          </button>
          {dateOpen ? (
            <div className="mt-3 grid gap-3">
              <label className="block">
                <span
                  className={cn(
                    "mb-1 block text-xs font-medium text-slate-600",
                    isRtl && "text-right",
                  )}
                >
                  {t.orderList.dueFrom}
                </span>
                <Input
                  type="date"
                  value={draft.dueFrom}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      filter: prev.filter === "due_this_week" ? "" : prev.filter,
                      dueFrom: e.target.value,
                    }))
                  }
                  className="h-10 bg-white"
                />
              </label>
              <label className="block">
                <span
                  className={cn(
                    "mb-1 block text-xs font-medium text-slate-600",
                    isRtl && "text-right",
                  )}
                >
                  {t.orderList.dueTo}
                </span>
                <Input
                  type="date"
                  value={draft.dueTo}
                  min={draft.dueFrom || undefined}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      filter: prev.filter === "due_this_week" ? "" : prev.filter,
                      dueTo: e.target.value,
                    }))
                  }
                  className="h-10 bg-white"
                />
              </label>
            </div>
          ) : null}
        </section>
      </div>
    </BottomSheet>
  );
}
