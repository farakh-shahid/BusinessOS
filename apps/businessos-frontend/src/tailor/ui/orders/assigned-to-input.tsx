"use client";

import { useEffect, useId, useState } from "react";
import { User } from "lucide-react";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";

interface AssignedToInputProps {
  t: Dictionary;
  value: string;
  onChange: (value: string) => void;
  onCommit?: (value: string) => void | Promise<void>;
  suggestions?: string[];
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
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  async function commit(next: string) {
    const trimmed = next.trim();
    onChange(trimmed);
    if (onCommit && trimmed !== value.trim()) {
      await onCommit(trimmed);
    }
  }

  const inputProps = {
    id: inputId,
    list: suggestions.length > 0 ? listId : undefined,
    value: draft,
    disabled,
    placeholder: t.form.assignedToPlaceholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value),
    onBlur: () => {
      void commit(draft);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        void commit(draft);
        (e.target as HTMLInputElement).blur();
      }
    },
  };

  return (
    <div className={cn(className, isRtl && "text-right")}>
      {showLabel && variant === "default" ? (
        <Label htmlFor={inputId} className={compact ? "text-xs" : undefined}>
          {t.form.assignedTo}
        </Label>
      ) : null}

      {variant === "tagged" ? (
        <div
          className={cn(
            "flex h-9 w-full items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white",
            isRtl && "flex-row-reverse",
          )}
        >
          <div
            className={cn(
              "flex shrink-0 items-center gap-1 bg-slate-50 px-2 text-[10px] font-medium text-slate-500",
              isRtl
                ? "border-l border-slate-100"
                : "border-r border-slate-100",
            )}
          >
            <User className="h-3 w-3 shrink-0 text-brand-600" />
            <span className="whitespace-nowrap">
              {t.form.assignedTo.split("(")[0]?.trim() ?? t.form.assignedTo}
            </span>
          </div>
          <input
            {...inputProps}
            className={cn(
              "min-w-0 flex-1 bg-transparent px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
              isRtl && "text-right",
            )}
          />
        </div>
      ) : (
        <Input
          {...inputProps}
          className={cn(compact && "h-9 text-xs")}
        />
      )}

      {suggestions.length > 0 ? (
        <datalist id={listId}>
          {suggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      ) : null}
      {!compact && showLabel && variant === "default" ? (
        <p className="mt-1 text-xs text-slate-500">{t.form.assignedToHint}</p>
      ) : null}
    </div>
  );
}
