"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { routes } from "@/core/config/routes";
import { useAssignmentsQuery } from "@/tailor/infrastructure/api/hooks/use-orders";
import {
  loadAssignmentView,
  persistAssignmentView,
  type AssignmentView,
  type PersonBoardWorkerKey,
} from "@/tailor/infrastructure/data/assignment-board-utils";
import { AssignmentsSkeleton } from "@/tailor/ui/skeletons";
import { BackLink } from "@/tailor/ui/shared/back-link";
import { PageHeader } from "@/tailor/ui/shared/page-header";
import { AssignmentKanbanBoard } from "@/tailor/ui/assignments/assignment-kanban-board";
import { AssignmentPeopleGrid } from "@/tailor/ui/assignments/assignment-people-grid";
import { AssignmentPersonStatusBoard } from "@/tailor/ui/assignments/assignment-person-status-board";
import { AssignmentTableView } from "@/tailor/ui/assignments/assignment-table-view";
import { AssignmentViewSwitcher } from "@/tailor/ui/assignments/assignment-view-switcher";

export function AssignmentsView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data, isLoading, isError } = useAssignmentsQuery();
  const [view, setView] = useState<AssignmentView>("grid");
  const [selectedPerson, setSelectedPerson] = useState<PersonBoardWorkerKey | null>(
    null,
  );

  useEffect(() => {
    setView(loadAssignmentView());
  }, []);

  function handleViewChange(next: AssignmentView) {
    setView(next);
    setSelectedPerson(null);
    persistAssignmentView(next);
  }

  const subtitle =
    view === "grid" && selectedPerson
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

      {!isLoading && !isError && data ? (
        <div
          className={cn(
            "mb-4 flex justify-end",
            isRtl && "justify-start",
          )}
        >
          <AssignmentViewSwitcher
            view={view}
            t={t}
            isRtl={isRtl}
            onChange={handleViewChange}
          />
        </div>
      ) : null}

      {isLoading ? (
        <AssignmentsSkeleton />
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
