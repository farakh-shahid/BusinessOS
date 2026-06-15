"use client";

import { useMemo } from "react";
import type { Dictionary } from "@business-os/i18n";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { cn } from "@/core/presentation/lib/utils";
import {
  formatAssigneeWorkloadCount,
  sortAssigneeNamesByWorkload,
} from "@/tailor/infrastructure/data/assignee-workload";

interface AssignWorkerSelectProps {
  value: string;
  assignees: string[];
  assigneeWorkload?: Record<string, number>;
  onChange: (name: string) => void;
  t: Dictionary;
  isRtl?: boolean;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
}

export function AssignWorkerSelect({
  value,
  assignees,
  assigneeWorkload,
  onChange,
  t,
  isRtl,
  disabled,
  className,
  buttonClassName,
}: AssignWorkerSelectProps) {
  const options = useMemo(() => {
    const names = sortAssigneeNamesByWorkload(assignees, assigneeWorkload);
    const workerOptions = names.map((name) => ({
      value: name,
      label: name,
      description:
        assigneeWorkload && name in assigneeWorkload
          ? formatAssigneeWorkloadCount(assigneeWorkload[name] ?? 0, t)
          : undefined,
    }));

    const trimmed = value.trim();
    if (trimmed && !names.includes(trimmed)) {
      workerOptions.unshift({ value: trimmed, label: trimmed, description: undefined });
    }

    return [{ value: "", label: t.form.assignedToNone }, ...workerOptions];
  }, [assigneeWorkload, assignees, t, value]);

  return (
    <SearchableCombobox
      value={value.trim() ? value : ""}
      onChange={onChange}
      options={options}
      placeholder={t.form.assignWorkerPlaceholder}
      searchPlaceholder={t.form.searchWorker}
      emptyMessage={t.form.noOptions}
      disabled={disabled}
      isRtl={isRtl}
      searchMinOptions={1}
      className={className}
      menuClassName="min-w-[min(100vw-1.5rem,20rem)]"
      buttonClassName={cn(
        "rounded-[10px] border-hairline bg-background text-[13px] font-medium text-foreground",
        buttonClassName,
      )}
      aria-label={t.orderDetail.assignedTailor}
    />
  );
}
