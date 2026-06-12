"use client";

import { useEffect, useId, useState } from "react";
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

  return (
    <div className={cn(className, isRtl && "text-right")}>
      {showLabel ? (
        <Label htmlFor={inputId} className={compact ? "text-xs" : undefined}>
          {t.form.assignedTo}
        </Label>
      ) : null}
      <Input
        id={inputId}
        list={suggestions.length > 0 ? listId : undefined}
        value={draft}
        disabled={disabled}
        placeholder={t.form.assignedToPlaceholder}
        className={cn(compact && "h-9 text-xs")}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          void commit(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            void commit(draft);
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
      {suggestions.length > 0 ? (
        <datalist id={listId}>
          {suggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      ) : null}
      {!compact && showLabel ? (
        <p className="mt-1 text-xs text-slate-500">{t.form.assignedToHint}</p>
      ) : null}
    </div>
  );
}
