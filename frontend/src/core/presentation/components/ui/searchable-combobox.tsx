"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";
import type { StaffBadgeTone } from "@/features/infrastructure/data/use-staff-identity";

function badgeToneClass(tone: StaffBadgeTone): string {
  switch (tone) {
    case "you":
      return "bg-brand-50 text-brand-700 ring-1 ring-brand-100";
    case "admin":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-100";
    case "tailor":
      return "bg-amber-50 text-amber-800 ring-1 ring-amber-100";
    default:
      return "bg-slate-100 text-muted-slate ring-1 ring-hairline";
  }
}

function OptionBadges({
  badges,
  isRtl,
}: {
  badges: ComboboxOption["badges"];
  isRtl?: boolean;
}) {
  if (!badges?.length) return null;
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-1",
        isRtl && "flex-row-reverse",
      )}
    >
      {badges.map((badge) => (
        <span
          key={`${badge.tone}-${badge.label}`}
          className={cn(
            "inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
            badgeToneClass(badge.tone),
          )}
        >
          {badge.label}
        </span>
      ))}
    </span>
  );
}

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  badges?: Array<{ label: string; tone: "you" | "admin" | "staff" | "tailor" }>;
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
  /** Plain: name + description stacked; hides badges in the closed button */
  buttonSummary?: "full" | "plain";
  /** Shown under the label when value is set but not in options */
  orphanDescription?: string;
  disabled?: boolean;
  /** Prevent row/card click when used inside clickable parents */
  stopClickPropagation?: boolean;
  searchMinOptions?: number;
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
  const estimatedMenuHeight = 260;
  const spaceBelow = window.innerHeight - rect.bottom - viewportPad;
  const spaceAbove = rect.top - viewportPad;
  const placement: MenuPlacement =
    spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow ? "top" : "bottom";
  const maxHeight =
    placement === "bottom"
      ? Math.max(140, spaceBelow - gap)
      : Math.max(140, spaceAbove - gap);
  const width = Math.min(rect.width, window.innerWidth - viewportPad * 2);
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
  buttonSummary = "full",
  orphanDescription,
  disabled = false,
  stopClickPropagation = false,
  searchMinOptions = 5,
  "aria-label": ariaLabel,
}: SearchableComboboxProps) {
  const autoId = useId();
  const listboxId = id ?? autoId;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [mounted, setMounted] = useState(false);

  const selected = options.find((o) => o.value === value);
  const buttonSelection =
    selected ??
    (value.trim()
      ? {
          value,
          label: value,
          description: orphanDescription,
        }
      : undefined);

  const filtered = options.filter((o) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      o.label.toLowerCase().includes(q) ||
      o.description?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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

  function selectOption(next: string) {
    onChange(next);
    setOpen(false);
  }

  function isolatePointerEvent(event: React.MouseEvent) {
    if (!stopClickPropagation) return;
    event.preventDefault();
    event.stopPropagation();
  }

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
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40 flex flex-col",
        isRtl && "text-right",
        menuClassName,
      )}
    >
      {options.length >= searchMinOptions && (
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
      )}

      <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5">
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
                    <span
                      className={cn(
                        "flex flex-wrap items-center gap-1.5",
                        isRtl && "flex-row-reverse justify-end",
                      )}
                    >
                      <span className="truncate font-medium">{option.label}</span>
                      <OptionBadges badges={option.badges} isRtl={isRtl} />
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
        onClick={(e) => {
          isolatePointerEvent(e);
          if (!disabled) setOpen((prev) => !prev);
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border px-3 text-sm outline-none transition-colors",
          !buttonClassName?.includes("border-status-") &&
            !buttonClassName?.includes("border-2") &&
            "border-slate-200 bg-white",
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
            "min-w-0 flex-1 text-left",
            isRtl && "text-right",
            buttonSelection ? "text-inherit" : "text-slate-400",
          )}
        >
          {buttonSelection ? (
            buttonSummary === "plain" ? (
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate font-semibold leading-snug">
                  {buttonSelection.label}
                </span>
                {buttonSelection.description ? (
                  <span className="truncate text-xs font-normal text-slate-500">
                    {buttonSelection.description}
                  </span>
                ) : null}
              </span>
            ) : (
              <span
                className={cn(
                  "inline-flex min-w-0 flex-wrap items-center gap-1.5",
                  isRtl && "flex-row-reverse justify-end",
                )}
              >
                <span className="font-medium">{buttonSelection.label}</span>
                <OptionBadges badges={selected?.badges} isRtl={isRtl} />
                {buttonSelection.description ? (
                  <span className="text-slate-500"> · {buttonSelection.description}</span>
                ) : null}
              </span>
            )
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            buttonClassName?.includes("text-status-")
              ? "text-current opacity-70"
              : "text-slate-400",
            open &&
              (buttonClassName?.includes("text-status-")
                ? "rotate-180 opacity-100"
                : "rotate-180 text-brand-700"),
          )}
        />
      </button>

      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
