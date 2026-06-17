"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { BottomSheet } from "@/core/presentation/components/ui/bottom-sheet";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import type { CustomerRegisteredPreset } from "@/tailor/infrastructure/data/customer-list-filters";
import {
  emptyRegistrationFilter,
  type CustomerRegistrationFilter,
} from "@/tailor/infrastructure/data/customer-list-filters";

const PRESET_OPTIONS: CustomerRegisteredPreset[] = [
  "this_week",
  "last_week",
  "this_month",
  "last_month",
  "custom",
];

interface CustomerFiltersSheetProps {
  open: boolean;
  registration: CustomerRegistrationFilter;
  t: Dictionary;
  isRtl: boolean;
  onClose: () => void;
  onApply: (registration: CustomerRegistrationFilter) => void;
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

export function CustomerFiltersSheet({
  open,
  registration,
  t,
  isRtl,
  onClose,
  onApply,
}: CustomerFiltersSheetProps) {
  const [draft, setDraft] = useState<CustomerRegistrationFilter>(registration);

  useEffect(() => {
    if (open) setDraft(registration);
  }, [open, registration]);

  function presetLabel(preset: CustomerRegisteredPreset): string {
    if (preset === "this_week") return t.customerFilters.registeredThisWeek;
    if (preset === "last_week") return t.customerFilters.registeredLastWeek;
    if (preset === "this_month") return t.customerFilters.registeredThisMonth;
    if (preset === "last_month") return t.customerFilters.registeredLastMonth;
    return t.customerFilters.registeredCustom;
  }

  function handleReset() {
    const cleared = emptyRegistrationFilter();
    setDraft(cleared);
    onApply(cleared);
    onClose();
  }

  return (
    <BottomSheet
      open={open}
      title={t.customerFilters.filtersTitle}
      onClose={onClose}
      isRtl={isRtl}
      footer={
        <div
          className={cn(
            "flex flex-col gap-2 sm:flex-row",
            isRtl && "sm:flex-row-reverse",
          )}
        >
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex-1"
          >
            {t.customerFilters.resetFilters}
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="w-full rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white hover:bg-brand-800 sm:flex-[2]"
          >
            {t.customerFilters.applyFilters}
          </button>
        </div>
      }
    >
      <div className="space-y-4 overflow-y-auto px-4 pb-4">
        <div>
          <p
            className={cn(
              "mb-2 text-xs font-bold uppercase tracking-wide text-slate-400",
              isRtl && "text-right",
            )}
          >
            {t.customerFilters.registeredSection}
          </p>
          <div className="space-y-2">
            <FilterOption
              label={t.customerFilters.registeredAny}
              selected={draft.preset === ""}
              onSelect={() =>
                setDraft(emptyRegistrationFilter())
              }
              isRtl={isRtl}
            />
            {PRESET_OPTIONS.map((preset) => (
              <FilterOption
                key={preset}
                label={presetLabel(preset)}
                selected={draft.preset === preset}
                onSelect={() =>
                  setDraft((prev) => ({
                    ...prev,
                    preset,
                  }))
                }
                isRtl={isRtl}
              />
            ))}
          </div>
        </div>

        {draft.preset === "custom" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="customer-reg-from">{t.customerFilters.fromDate}</Label>
              <Input
                id="customer-reg-from"
                type="date"
                value={draft.from}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, from: e.target.value }))
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="customer-reg-to">{t.customerFilters.toDate}</Label>
              <Input
                id="customer-reg-to"
                type="date"
                value={draft.to}
                min={draft.from || undefined}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, to: e.target.value }))
                }
                className="mt-1.5"
              />
            </div>
          </div>
        ) : null}
      </div>
    </BottomSheet>
  );
}
