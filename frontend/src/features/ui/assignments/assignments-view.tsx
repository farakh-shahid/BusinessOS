"use client";

import { useMemo, useState } from "react";
import { getDictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { routes } from "@/core/config/routes";
import {
  useAssignmentsQuery,
  useProductionPerformanceQuery,
} from "@/features/infrastructure/api/hooks/use-orders";
import {
  defaultPerformanceDateRange,
  inferPerformanceDatePreset,
  loadAssignmentPageMode,
  loadAssignmentView,
  performanceRangeForPreset,
  persistAssignmentPageMode,
  persistAssignmentView,
  type AssignmentPageMode,
  type AssignmentView,
  type PerformanceDatePreset,
  type PersonBoardWorkerKey,
} from "@/features/infrastructure/data/assignment-board-utils";
import {
  AssignmentsSkeleton,
  AssignmentViewSwitcherSkeleton,
} from "@/features/ui/skeletons";
import { BackLink } from "@/features/ui/shared/back-link";
import { PageHeader } from "@/features/ui/shared/page-header";
import { AssignmentKanbanBoard } from "@/features/ui/assignments/assignment-kanban-board";
import { AssignmentPeopleGrid } from "@/features/ui/assignments/assignment-people-grid";
import { AssignmentPersonStatusBoard } from "@/features/ui/assignments/assignment-person-status-board";
import { AssignmentTableView } from "@/features/ui/assignments/assignment-table-view";
import { AssignmentViewSwitcher } from "@/features/ui/assignments/assignment-view-switcher";
import { AssignmentModeSwitcher } from "@/features/ui/assignments/assignment-mode-switcher";
import { AssignmentPerformanceView } from "@/features/ui/assignments/assignment-performance-view";

export function AssignmentsView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data, isLoading, isError } = useAssignmentsQuery();
  const [pageMode, setPageMode] = useState<AssignmentPageMode>(() =>
    loadAssignmentPageMode(),
  );
  const [view, setView] = useState<AssignmentView>(() => loadAssignmentView());
  const [selectedPerson, setSelectedPerson] = useState<PersonBoardWorkerKey | null>(
    null,
  );

  const defaultRange = useMemo(() => defaultPerformanceDateRange(), []);
  const [datePreset, setDatePreset] = useState<PerformanceDatePreset>("this_month");
  const [draftFrom, setDraftFrom] = useState(defaultRange.from);
  const [draftTo, setDraftTo] = useState(defaultRange.to);
  const [appliedFrom, setAppliedFrom] = useState(defaultRange.from);
  const [appliedTo, setAppliedTo] = useState(defaultRange.to);
  const [performanceWorker, setPerformanceWorker] = useState<string | null>(null);

  function applyPerformancePreset(preset: PerformanceDatePreset) {
    setDatePreset(preset);
    setPerformanceWorker(null);
    if (preset === "custom") return;
    const range = performanceRangeForPreset(preset);
    setDraftFrom(range.from);
    setDraftTo(range.to);
    setAppliedFrom(range.from);
    setAppliedTo(range.to);
  }

  function handlePerformanceFromChange(value: string) {
    setDraftFrom(value);
    setDatePreset("custom");
  }

  function handlePerformanceToChange(value: string) {
    setDraftTo(value);
    setDatePreset("custom");
  }

  function applyPerformanceRange() {
    setDatePreset(inferPerformanceDatePreset(draftFrom, draftTo));
    setAppliedFrom(draftFrom);
    setAppliedTo(draftTo);
    setPerformanceWorker(null);
  }

  const performanceQuery = useProductionPerformanceQuery(
    {
      from: appliedFrom || undefined,
      to: appliedTo || undefined,
      worker: performanceWorker || undefined,
    },
    pageMode === "performance",
  );

  function handlePageModeChange(next: AssignmentPageMode) {
    setPageMode(next);
    persistAssignmentPageMode(next);
    setSelectedPerson(null);
    setPerformanceWorker(null);
  }

  function handleViewChange(next: AssignmentView) {
    setView(next);
    setSelectedPerson(null);
    persistAssignmentView(next);
  }

  function clearPerformanceRange() {
    applyPerformancePreset("all_time");
  }

  const subtitle =
    pageMode === "performance"
      ? t.assignments.performanceSubtitle
      : view === "grid" && selectedPerson
        ? t.assignments.personBoardPageSubtitle
        : view === "grid"
          ? t.assignments.gridSubtitle
          : t.assignments.subtitle;

  return (
    <>
      <BackLink href={routes.dashboard} label={t.nav.dashboard} isRtl={isRtl} />

      <PageHeader
        title={t.assignments.title}
        subtitle={subtitle}
        isRtl={isRtl}
      />

      <div
        className={cn(
          "mb-4 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          isRtl && "sm:flex-row-reverse",
        )}
      >
        <div className="w-full min-w-0 sm:w-auto">
          <AssignmentModeSwitcher
            mode={pageMode}
            t={t}
            isRtl={isRtl}
            onChange={handlePageModeChange}
          />
        </div>

        {pageMode === "workload" && !isLoading && !isError && data ? (
          <div className="w-full min-w-0 sm:w-auto">
            <AssignmentViewSwitcher
              view={view}
              t={t}
              isRtl={isRtl}
              onChange={handleViewChange}
            />
          </div>
        ) : pageMode === "workload" && isLoading ? (
          <AssignmentViewSwitcherSkeleton isRtl={isRtl} />
        ) : null}
      </div>

      {pageMode === "performance" ? (
        performanceQuery.isLoading ? (
          <div className="rounded-2xl border border-hairline bg-card px-4 py-10 text-center text-sm text-muted-slate">
            {t.common.loading}
          </div>
        ) : performanceQuery.isError || !performanceQuery.data ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
            {t.common.error}
          </div>
        ) : (
          <AssignmentPerformanceView
            data={performanceQuery.data}
            datePreset={datePreset}
            from={draftFrom}
            to={draftTo}
            selectedWorker={performanceWorker}
            onPresetChange={applyPerformancePreset}
            onFromChange={handlePerformanceFromChange}
            onToChange={handlePerformanceToChange}
            onApplyRange={applyPerformanceRange}
            onClearRange={clearPerformanceRange}
            onSelectWorker={setPerformanceWorker}
            t={t}
            isRtl={isRtl}
          />
        )
      ) : isLoading ? (
        <AssignmentsSkeleton view={view} />
      ) : isError || !data ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      ) : view === "table" ? (
        <AssignmentTableView data={data} t={t} isRtl={isRtl} />
      ) : view === "board" ? (
        <AssignmentKanbanBoard data={data} t={t} isRtl={isRtl} />
      ) : selectedPerson ? (
        <AssignmentPersonStatusBoard
          data={data}
          workerKey={selectedPerson}
          t={t}
          isRtl={isRtl}
          onBack={() => setSelectedPerson(null)}
        />
      ) : (
        <AssignmentPeopleGrid
          data={data}
          t={t}
          isRtl={isRtl}
          onSelectPerson={setSelectedPerson}
        />
      )}
    </>
  );
}
