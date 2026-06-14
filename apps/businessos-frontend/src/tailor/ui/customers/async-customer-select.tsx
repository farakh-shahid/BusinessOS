"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import type { TailorCustomer } from "@business-os/tailor";
import { cn } from "@/core/presentation/lib/utils";
import {
  LOOKUP_MIN_LENGTH,
  useCustomerLookupQuery,
} from "@/tailor/infrastructure/api/hooks/use-customer-lookup";

interface AsyncCustomerSelectProps {
  id?: string;
  value: string;
  selectedCustomer?: TailorCustomer | null;
  onChange: (customerId: string, customer: TailorCustomer) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  searchHint?: string;
  searchingLabel?: string;
  isRtl?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

type MenuPlacement = "bottom" | "top";

interface MenuPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: MenuPlacement;
}

function computeMenuPosition(button: HTMLElement): MenuPosition {
  const rect = button.getBoundingClientRect();
  const viewportPad = 12;
  const gap = 6;
  const estimatedMenuHeight = 320;
  const spaceBelow = window.innerHeight - rect.bottom - viewportPad;
  const spaceAbove = rect.top - viewportPad;
  const placement: MenuPlacement =
    spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow ? "top" : "bottom";
  const maxHeight =
    placement === "bottom"
      ? Math.max(160, spaceBelow - gap)
      : Math.max(160, spaceAbove - gap);
  const width = Math.min(Math.max(rect.width, 280), window.innerWidth - viewportPad * 2);
  const left = Math.min(
    Math.max(viewportPad, rect.left),
    window.innerWidth - width - viewportPad,
  );

  return {
    top: placement === "bottom" ? rect.bottom + gap : rect.top - gap,
    left,
    width,
    maxHeight,
    placement,
  };
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function AsyncCustomerSelect({
  id,
  value,
  selectedCustomer,
  onChange,
  placeholder = "Select customer…",
  searchPlaceholder = "Search by name or phone…",
  emptyMessage = "No customers found",
  searchHint = "Type at least 2 characters to search",
  searchingLabel = "Searching…",
  isRtl = false,
  className,
  buttonClassName,
  menuClassName,
  disabled = false,
  "aria-label": ariaLabel,
}: AsyncCustomerSelectProps) {
  const autoId = useId();
  const listboxId = id ?? autoId;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [mounted, setMounted] = useState(false);
  const [pickedCustomer, setPickedCustomer] = useState<TailorCustomer | null>(
    null,
  );

  const debouncedQuery = useDebouncedValue(query, 300);
  const lookupQuery = useCustomerLookupQuery(debouncedQuery, open);

  const displayCustomer =
    pickedCustomer?.id === value
      ? pickedCustomer
      : selectedCustomer?.id === value
        ? selectedCustomer
        : pickedCustomer;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedCustomer?.id === value) {
      setPickedCustomer(selectedCustomer);
    }
  }, [selectedCustomer, value]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setMenuPosition(null);
      return;
    }

    function updatePosition() {
      if (!buttonRef.current) return;
      setMenuPosition(computeMenuPosition(buttonRef.current));
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
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

  function selectCustomer(customer: TailorCustomer) {
    setPickedCustomer(customer);
    onChange(customer.id, customer);
    setOpen(false);
  }

  const trimmedQuery = debouncedQuery.trim();
  const queryTooShort = trimmedQuery.length < LOOKUP_MIN_LENGTH;
  const results = lookupQuery.data ?? [];
  const showLoading = !queryTooShort && lookupQuery.isFetching;
  const showHint = query.trim().length < LOOKUP_MIN_LENGTH;
  const showEmpty =
    !queryTooShort && !lookupQuery.isFetching && results.length === 0;

  const menu = open && menuPosition ? (
    <div
      ref={menuRef}
      role="listbox"
      aria-labelledby={listboxId}
      style={{
        position: "fixed",
        top: menuPosition.top,
        left: menuPosition.left,
        width: menuPosition.width,
        maxHeight: menuPosition.maxHeight,
        transform:
          menuPosition.placement === "top" ? "translateY(-100%)" : undefined,
        zIndex: 9999,
      }}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40",
        isRtl && "text-right",
        menuClassName,
      )}
    >
      <div className="shrink-0 border-b border-slate-100 p-2">
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

      <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5">
        {showHint ? (
          <li className="px-3 py-6 text-center text-sm text-slate-400">
            {searchHint}
          </li>
        ) : showLoading ? (
          <li
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-6 text-sm text-slate-500",
              isRtl && "flex-row-reverse",
            )}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            {searchingLabel}
          </li>
        ) : showEmpty ? (
          <li className="px-3 py-6 text-center text-sm text-slate-400">
            {emptyMessage}
          </li>
        ) : (
          results.map((customer) => {
            const active = customer.id === value;
            return (
              <li key={customer.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => selectCustomer(customer)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-50",
                    isRtl && "flex-row-reverse text-right",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">
                      {customer.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500" dir="ltr">
                      {customer.phone}
                    </span>
                  </span>
                  {active ? (
                    <Check className="h-4 w-4 shrink-0 text-slate-900" />
                  ) : null}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  ) : null;

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        id={listboxId}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border px-3 text-sm outline-none transition-colors",
          !buttonClassName?.includes("border-status-") &&
            !buttonClassName?.includes("border-2") &&
            !buttonClassName?.includes("border-0") &&
            "border-slate-200 bg-white",
          !buttonClassName?.includes("h-") && !buttonClassName?.includes("min-h-") && "h-11",
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
            "min-w-0 flex-1 truncate text-left",
            isRtl && "text-right",
            displayCustomer ? "text-inherit" : "text-slate-400",
          )}
        >
          {displayCustomer ? (
            <>
              <span className="font-medium">{displayCustomer.name}</span>
              <span className="text-slate-500"> · {displayCustomer.phone}</span>
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

      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
