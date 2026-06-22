"use client";

import { useMemo } from "react";
import type { Dictionary } from "@/i18n";
import { SearchableCombobox } from "@/core/presentation/components/ui/searchable-combobox";
import { cn } from "@/core/presentation/lib/utils";
import { useStaffIdentity } from "@/features/infrastructure/data/use-staff-identity";
import {
  formatAssigneeWorkloadCount,
  sortAssigneeNamesByWorkload,
} from "@/features/infrastructure/data/assignee-workload";

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
  plainButton?: boolean;
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
  plainButton = false,
}: AssignWorkerSelectProps) {
  const { badgesForName } = useStaffIdentity(t);

  const options = useMemo(() => {
    const names = sortAssigneeNamesByWorkload(assignees, assigneeWorkload);
    const workerOptions = names.map((name) => ({
      value: name,
      label: name,
      description:
        assigneeWorkload && name in assigneeWorkload
          ? formatAssigneeWorkloadCount(assigneeWorkload[name] ?? 0, t)
          : undefined,
      badges: badgesForName(name),
    }));

    return [{ value: "", label: t.form.assignedToNone }, ...workerOptions];
  }, [assigneeWorkload, assignees, badgesForName, t]);

  const trimmedValue = value.trim();
  const formerMember =
    trimmedValue.length > 0 && !assignees.includes(trimmedValue);

  return (
    <SearchableCombobox
      value={trimmedValue ? value : ""}
      onChange={onChange}
      options={options}
      placeholder={t.form.assignWorkerPlaceholder}
      searchPlaceholder={t.form.searchWorker}
      emptyMessage={t.form.noOptions}
      disabled={disabled}
      isRtl={isRtl}
      searchMinOptions={1}
      buttonSummary={plainButton ? "plain" : "full"}
      orphanDescription={
        formerMember ? t.orderDetail.assigneeNoLongerOnTeam : undefined
      }
      className={className}
      menuClassName="min-w-[min(100vw-1.5rem,20rem)]"
      buttonClassName={cn(
        "rounded-[10px] border-hairline bg-background text-[13px] font-medium text-foreground",
        plainButton && "h-auto min-h-11 items-start py-2.5",
        buttonClassName,
      )}
      aria-label={t.orderDetail.assignedTailor}
    />
  );
}
