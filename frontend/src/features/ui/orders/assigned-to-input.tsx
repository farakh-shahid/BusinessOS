"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { User } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";
import {
  formatAssigneeWorkloadCount,
  sortAssigneeNamesByWorkload,
} from "@/features/infrastructure/data/assignee-workload";

interface AssignedToInputProps {
  t: Dictionary;
  value: string;
  onChange: (value: string) => void;
  onCommit?: (value: string) => void | Promise<void>;
  suggestions?: string[];
  assigneeWorkload?: Record<string, number>;
  isRtl?: boolean;
  disabled?: boolean;
  compact?: boolean;
  showLabel?: boolean;
  /** Card layout: icon + "Assigned to" prefix beside the name field */
  variant?: "default" | "tagged";
  id?: string;
  className?: string;
}

export function AssignedToInput({
  t,
  value,
  onChange,
  onCommit,
  suggestions = [],
  assigneeWorkload,
  isRtl = false,
  disabled = false,
  compact = false,
  showLabel = true,
  variant = "default",
  id,
  className,
}: AssignedToInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const listId = `${inputId}-suggestions`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const filteredSuggestions = useMemo(() => {
    const query = draft.trim().toLowerCase();
    const matches = suggestions.filter((name) => {
      if (!query) return true;
      return name.toLowerCase().includes(query);
    });
    return sortAssigneeNamesByWorkload(matches, assigneeWorkload);
  }, [assigneeWorkload, draft, suggestions]);

  const selectedWorkload =
    draft.trim() && assigneeWorkload && draft.trim() in assigneeWorkload
      ? assigneeWorkload[draft.trim()]
      : undefined;

  async function commit(next: string) {
    const trimmed = next.trim();
    onChange(trimmed);
    if (onCommit && trimmed !== value.trim()) {
      await onCommit(trimmed);
    }
  }

  async function pickSuggestion(name: string) {
    setDraft(name);
    setOpen(false);
    await commit(name);
  }

  const placeholder =
    variant === "tagged"
      ? t.form.assignWorkerPlaceholder
      : t.form.assignedToPlaceholder;

  const showPicker = suggestions.length > 0 && open && !disabled;

  const inputProps = {
    id: inputId,
    value: draft,
    disabled,
    placeholder,
    onFocus: () => {
      if (suggestions.length > 0) setOpen(true);
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraft(e.target.value);
      if (suggestions.length > 0) setOpen(true);
    },
    onBlur: () => {
      void commit(draft);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        void commit(draft);
        setOpen(false);
        (e.target as HTMLInputElement).blur();
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className, isRtl && "text-right")}
    >
      {showLabel && variant === "default" ? (
        <Label htmlFor={inputId} className={compact ? "text-xs" : undefined}>
          {t.form.assignedTo}
        </Label>
      ) : null}

      {variant === "tagged" ? (
        <div
          className={cn(
            "flex h-9 w-full min-w-0 items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white",
            isRtl && "flex-row-reverse",
          )}
        >
          <div
            className={cn(
              "flex shrink-0 items-center gap-1 bg-slate-50 text-[10px] font-semibold text-slate-600",
              compact ? "px-2" : "px-2.5",
              isRtl
                ? "border-l border-slate-100"
                : "border-r border-slate-100",
            )}
            title={t.form.assignedTo}
          >
            <User className="h-3 w-3 shrink-0 text-brand-600" />
            <span className="whitespace-nowrap">{t.form.assignWorker}</span>
          </div>
          <div className="relative min-w-0 flex-1">
            {draft.trim() ? (
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center px-2",
                  isRtl && "justify-end",
                )}
                aria-hidden
              >
                <PersonNameText
                  name={draft}
                  className={cn(
                    "text-[11px] text-slate-700",
                    isRtl && "flex-row-reverse",
                  )}
                />
              </div>
            ) : null}
            <input
              {...inputProps}
              title={draft.trim() ? draft : t.form.assignWorkerPlaceholder}
              aria-label={t.form.assignWorker}
              aria-expanded={showPicker}
              aria-controls={showPicker ? listId : undefined}
              className={cn(
                "h-full w-full min-w-0 bg-transparent px-2 text-[11px] font-medium text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
                draft.trim() && "text-transparent",
                !disabled && draft.trim() && "caret-slate-700",
                isRtl && "text-right",
              )}
            />
          </div>
        </div>
      ) : (
        <Input
          {...inputProps}
          aria-expanded={showPicker}
          aria-controls={showPicker ? listId : undefined}
          className={cn(compact && "h-9 text-xs")}
        />
      )}

      {showPicker ? (
        <ul
          id={listId}
          role="listbox"
          className={cn(
            "absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-hairline bg-white py-1 shadow-lg",
            isRtl && "text-right",
          )}
        >
          {filteredSuggestions.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted-slate">
              {t.form.noOptions}
            </li>
          ) : (
            filteredSuggestions.map((name) => {
              const count = assigneeWorkload?.[name];
              return (
                <li key={name} role="option">
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition hover:bg-slate-50",
                      isRtl && "flex-row-reverse text-right",
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => void pickSuggestion(name)}
                  >
                    <PersonNameText
                      name={name}
                      className={cn(
                        "min-w-0 text-sm font-medium text-foreground",
                        isRtl && "flex-row-reverse",
                      )}
                    />
                    {count !== undefined ? (
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-slate">
                        {formatAssigneeWorkloadCount(count, t)}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}

      {selectedWorkload !== undefined && variant === "default" && showLabel ? (
        <p className="mt-1 text-xs text-muted-slate">
          {formatAssigneeWorkloadCount(selectedWorkload, t)}
        </p>
      ) : null}

      {!compact && showLabel && variant === "default" ? (
        <p className="mt-1 text-xs text-slate-500">{t.form.assignedToHint}</p>
      ) : null}
    </div>
  );
}
