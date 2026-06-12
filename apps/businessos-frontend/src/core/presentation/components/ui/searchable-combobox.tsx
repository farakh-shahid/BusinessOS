"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

interface SearchableComboboxProps {
  id?: string;
  value: string;
  options: ComboboxOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isRtl?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  variant?: "default" | "compact";
  disabled?: boolean;
  /** Prevent row/card click when used inside clickable parents */
  stopClickPropagation?: boolean;
  searchMinOptions?: number;
  "aria-label"?: string;
}

export function SearchableCombobox({
  id,
  value,
  options,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results",
  isRtl = false,
  className,
  buttonClassName,
  menuClassName,
  variant = "default",
  disabled = false,
  stopClickPropagation = false,
  searchMinOptions = 5,
  "aria-label": ariaLabel,
}: SearchableComboboxProps) {
  const autoId = useId();
  const listboxId = id ?? autoId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter((o) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      o.label.toLowerCase().includes(q) ||
      o.description?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function selectOption(next: string) {
    onChange(next);
    setOpen(false);
  }

  function isolatePointerEvent(event: React.MouseEvent) {
    if (!stopClickPropagation) return;
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        id={listboxId}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={(e) => {
          isolatePointerEvent(e);
          if (!disabled) setOpen((prev) => !prev);
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition-colors",
          variant === "default" && "h-11",
          variant === "compact" &&
            "h-auto min-h-9 py-1.5 text-xs font-semibold",
          !disabled &&
            "hover:border-slate-300 focus:border-brand-700 focus:ring-2 focus:ring-brand-100",
          open && !disabled && "border-brand-700 ring-2 ring-brand-100",
          disabled && "cursor-not-allowed opacity-60",
          isRtl && "flex-row-reverse text-right",
          buttonClassName,
        )}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            selected ? "text-slate-900" : "text-slate-400",
          )}
        >
          {selected ? (
            <>
              <span className="font-medium">{selected.label}</span>
              {selected.description ? (
                <span className="text-slate-500"> · {selected.description}</span>
              ) : null}
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform",
            open && "rotate-180 text-brand-700",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-labelledby={listboxId}
          className={cn(
            "absolute z-[100] mt-1.5 w-full min-w-0 max-w-[min(100vw-2rem,24rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60",
            isRtl ? "right-0" : "left-0",
            isRtl && "text-right",
            menuClassName,
          )}
        >
          {options.length >= searchMinOptions && (
            <div className="border-b border-slate-100 p-2">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2",
                  isRtl && "flex-row-reverse",
                )}
              >
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    "w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400",
                    isRtl && "text-right",
                  )}
                  autoFocus
                />
              </div>
            </div>
          )}

          <ul className="max-h-60 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-slate-400">
                {emptyMessage}
              </li>
            ) : (
              filtered.map((option) => {
                const active = option.value === value;
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={(e) => {
                        isolatePointerEvent(e);
                        selectOption(option.value);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        active
                          ? "bg-brand-50 text-brand-900"
                          : "text-slate-700 hover:bg-slate-50",
                        isRtl && "flex-row-reverse text-right",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {option.label}
                        </span>
                        {option.description ? (
                          <span className="mt-0.5 block truncate text-xs text-slate-500">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                      {active ? (
                        <Check className="h-4 w-4 shrink-0 text-brand-700" />
                      ) : null}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
