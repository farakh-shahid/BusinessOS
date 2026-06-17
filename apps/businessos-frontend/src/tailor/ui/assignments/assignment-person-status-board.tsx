"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { AssignmentsOverview } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { getAvatarPaletteClass } from "@/core/presentation/lib/avatar-utils";
import { useToast } from "@/core/presentation/components/ui/toast";
import {
  useUpdateOrderStatusMutation,
} from "@/tailor/infrastructure/api/hooks/use-orders";
import {
  assignmentBoardColumnWidthClass,
  buildPersonStatusColumns,
  findAssignmentPerson,
  nameInitials,
  workflowStatusLabel,
  type PersonBoardWorkerKey,
  type PersonStatusColumn,
} from "@/tailor/infrastructure/data/assignment-board-utils";
import { boardColumnBorderClass } from "@/tailor/infrastructure/data/order-list-ui";
import { AssignmentOrderCard } from "@/tailor/ui/assignments/assignment-order-card";

interface AssignmentPersonStatusBoardProps {
  data: AssignmentsOverview;
  workerKey: PersonBoardWorkerKey;
  t: Dictionary;
  isRtl: boolean;
  onBack: () => void;
}

function StatusColumn({
  column,
  t,
  isRtl,
  isDropTarget,
  columnWidthClass,
  onDragOver,
  onDrop,
}: {
  column: PersonStatusColumn;
  t: Dictionary;
  isRtl: boolean;
  isDropTarget: boolean;
  columnWidthClass: string;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
}) {
  const label = workflowStatusLabel(column.status, t);

  return (
    <div
      className={cn(
        "flex h-[min(560px,calc(100vh-18rem))] shrink-0 flex-col rounded-[13px] border border-hairline border-t-[3px] bg-card p-[11px]",
        columnWidthClass,
        boardColumnBorderClass(column.status),
        isDropTarget && "ring-2 ring-brand-200 ring-offset-1",
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div
        className={cn(
          "mb-2.5 flex items-center justify-between gap-2 border-b border-hairline pb-2.5",
          isRtl && "flex-row-reverse",
        )}
      >
        <p className="truncate text-sm font-bold text-foreground">{label}</p>
        <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[10.5px] font-semibold text-muted-slate ring-1 ring-hairline">
          {column.orders.length}
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
        {column.orders.length === 0 ? (
          <p className="px-1 py-2 text-[11px] text-muted-slate">
            {t.assignments.noJobsInStage}
          </p>
        ) : (
          column.orders.map((order) => (
            <AssignmentOrderCard
              key={order.id}
              order={order}
              t={t}
              isRtl={isRtl}
              draggable
              showStatus={false}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function AssignmentPersonStatusBoard({
  data,
  workerKey,
  t,
  isRtl,
  onBack,
}: AssignmentPersonStatusBoardProps) {
  const { showError, showSuccess } = useToast();
  const updateStatus = useUpdateOrderStatusMutation();
  const [dropTargetStatus, setDropTargetStatus] = useState<string | null>(null);

  const person = findAssignmentPerson(data, workerKey, t);
  if (!person) return null;

  const columns = buildPersonStatusColumns(person.orders);
  const columnWidthClass = assignmentBoardColumnWidthClass(4);
  const isUnassigned = person.workerName === null;

  async function handleDrop(
    column: PersonStatusColumn,
    event: React.DragEvent,
  ) {
    event.preventDefault();
    setDropTargetStatus(null);

    const orderId = event.dataTransfer.getData("text/order-id");
    if (!orderId) return;

    const current = person?.orders.find((order) => order.id === orderId);
    if (!current || current.workflowStatus === column.status) return;

    try {
      await updateStatus.mutateAsync({
        orderId,
        payload: { status: column.status },
      });
      showSuccess(t.assignments.statusUpdated);
    } catch {
      showError(t.common.error);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex flex-col gap-3 rounded-[13px] border border-hairline bg-card p-4 sm:flex-row sm:items-center sm:justify-between",
          isRtl && "sm:flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-center gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <button
            type="button"
            onClick={onBack}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-background px-3 py-2 text-xs font-semibold text-muted-slate transition hover:bg-slate-50 hover:text-foreground",
              isRtl && "flex-row-reverse",
            )}
          >
            <ArrowLeft className={cn("h-4 w-4", isRtl && "rotate-180")} />
            {t.assignments.backToPeople}
          </button>

          {!isUnassigned ? (
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                getAvatarPaletteClass(person.workerName ?? ""),
              )}
            >
              {nameInitials(person.workerName ?? "")}
            </div>
          ) : null}

          <div className={cn("min-w-0", isRtl && "text-right")}>
            <h2 className="truncate font-display text-lg font-bold text-foreground">
              {person.displayName}
            </h2>
            <p className="text-sm text-muted-slate">
              {t.assignments.personBoardSubtitle.replace(
                "{count}",
                String(person.orderCount),
              )}
            </p>
          </div>
        </div>

        <span className="shrink-0 self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 ring-1 ring-brand-100 sm:self-center">
          {person.orderCount} {t.assignments.activeOrders}
        </span>
      </div>

      <div
        className={cn(
          "flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]",
          isRtl && "flex-row-reverse",
        )}
      >
        {columns.map((column) => (
          <StatusColumn
            key={column.status}
            column={column}
            t={t}
            isRtl={isRtl}
            columnWidthClass={columnWidthClass}
            isDropTarget={dropTargetStatus === column.status}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              setDropTargetStatus(column.status);
            }}
            onDrop={(event) => void handleDrop(column, event)}
          />
        ))}
      </div>
    </div>
  );
}
