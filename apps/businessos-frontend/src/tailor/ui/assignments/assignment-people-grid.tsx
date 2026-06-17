"use client";

import { ChevronRight, Users } from "lucide-react";
import type { AssignmentsOverview } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { getAvatarPaletteClass } from "@/core/presentation/lib/avatar-utils";
import {
  buildAssignmentPeopleGrid,
  nameInitials,
  PERSON_WORKFLOW_COLUMNS,
  workflowStatusLabel,
  type AssignmentPersonGridItem,
  type PersonBoardWorkerKey,
} from "@/tailor/infrastructure/data/assignment-board-utils";
import { boardColumnBorderClass } from "@/tailor/infrastructure/data/order-list-ui";

interface AssignmentPeopleGridProps {
  data: AssignmentsOverview;
  t: Dictionary;
  isRtl: boolean;
  onSelectPerson: (workerKey: PersonBoardWorkerKey) => void;
}

function StatusPill({
  status,
  count,
  t,
}: {
  status: (typeof PERSON_WORKFLOW_COLUMNS)[number];
  count: number;
  t: Dictionary;
}) {
  if (count === 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-hairline bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-slate",
        "border-t-[2px]",
        boardColumnBorderClass(status),
      )}
    >
      <span>{workflowStatusLabel(status, t)}</span>
      <span className="rounded-full bg-slate-100 px-1.5 text-[9px] text-foreground">
        {count}
      </span>
    </span>
  );
}

function PersonGridCard({
  person,
  t,
  isRtl,
  onSelect,
}: {
  person: AssignmentPersonGridItem;
  t: Dictionary;
  isRtl: boolean;
  onSelect: () => void;
}) {
  const isUnassigned = person.workerName === null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex h-full w-full flex-col rounded-[13px] border border-hairline bg-card p-4 text-left transition-all hover:border-brand-200 hover:shadow-md",
        isUnassigned && "border-dashed border-slate-300 bg-slate-50/60",
        isRtl && "text-right",
      )}
    >
      <div
        className={cn(
          "flex items-start justify-between gap-3",
          isRtl && "flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-center gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          {!isUnassigned ? (
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                getAvatarPaletteClass(person.workerName ?? ""),
              )}
            >
              {nameInitials(person.workerName ?? "")}
            </div>
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
              <Users className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-foreground">
              {person.displayName}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-slate">
              {person.roleLabel}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-slate ring-1 ring-hairline">
          {person.orderCount}
        </span>
      </div>

      <div
        className={cn(
          "mt-4 flex flex-wrap gap-1.5",
          isRtl && "flex-row-reverse justify-end",
        )}
      >
        {PERSON_WORKFLOW_COLUMNS.map((status) => (
          <StatusPill
            key={status}
            status={status}
            count={person.statusCounts[status]}
            t={t}
          />
        ))}
        {person.orderCount === 0 ? (
          <span className="text-[11px] text-muted-slate">
            {t.assignments.noJobsAssigned}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs font-semibold text-brand-700",
          isRtl && "flex-row-reverse",
        )}
      >
        <span>{t.assignments.openPersonBoard}</span>
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform group-hover:translate-x-0.5",
            isRtl && "rotate-180 group-hover:-translate-x-0.5",
          )}
        />
      </div>
    </button>
  );
}

export function AssignmentPeopleGrid({
  data,
  t,
  isRtl,
  onSelectPerson,
}: AssignmentPeopleGridProps) {
  const people = buildAssignmentPeopleGrid(data, t);

  if (people.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
        <p className="text-sm font-medium text-slate-700">
          {t.assignments.noAssignments}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {t.assignments.noAssignmentsHint}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {people.map((person) => (
        <PersonGridCard
          key={person.key}
          person={person}
          t={t}
          isRtl={isRtl}
          onSelect={() => onSelectPerson(person.key)}
        />
      ))}
    </div>
  );
}
