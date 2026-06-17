"use client";

import { useState } from "react";
import type { AssignmentsOverview } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { getAvatarPaletteClass } from "@/core/presentation/lib/avatar-utils";
import { useToast } from "@/core/presentation/components/ui/toast";
import {
  useUpdateOrderMutation,
} from "@/tailor/infrastructure/api/hooks/use-orders";
import {
  assignmentBoardColumnWidthClass,
  buildAssignmentColumns,
  nameInitials,
  splitAssignmentBoardRows,
  type AssignmentKanbanColumn,
} from "@/tailor/infrastructure/data/assignment-board-utils";
import { AssignmentOrderCard } from "@/tailor/ui/assignments/assignment-order-card";

interface AssignmentKanbanBoardProps {
  data: AssignmentsOverview;
  t: Dictionary;
  isRtl: boolean;
}

function AssignmentKanbanColumn({
  column,
  t,
  isRtl,
  isDropTarget,
  columnWidthClass,
  onDragOver,
  onDrop,
}: {
  column: AssignmentKanbanColumn;
  t: Dictionary;
  isRtl: boolean;
  isDropTarget: boolean;
  columnWidthClass: string;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
}) {
  const isUnassigned = column.workerName === null;

  return (
    <div
      className={cn(
        "flex h-[min(560px,calc(100vh-16rem))] shrink-0 flex-col rounded-[13px] border border-hairline bg-card p-[11px]",
        columnWidthClass,
        isDropTarget && "ring-2 ring-brand-200 ring-offset-1",
        isUnassigned && "border-dashed border-slate-300 bg-slate-50/50",
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div
        className={cn(
          "mb-2.5 flex items-start justify-between gap-2 border-b border-hairline pb-2.5",
          isRtl && "flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-center gap-2.5",
            isRtl && "flex-row-reverse",
          )}
        >
          {!isUnassigned ? (
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white",
                getAvatarPaletteClass(column.workerName ?? ""),
              )}
            >
              {nameInitials(column.workerName ?? "")}
            </div>
          ) : null}
          <div className={cn("min-w-0", isRtl && "text-right")}>
            <p className="truncate text-sm font-bold text-foreground">
              {column.displayName}
            </p>
            {column.roleLabel ? (
              <p className="truncate text-[11px] text-muted-slate">
                {column.roleLabel}
              </p>
            ) : null}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[10.5px] font-semibold text-muted-slate ring-1 ring-hairline">
          {column.orderCount}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto space-y-2 pr-0.5 [scrollbar-width:thin]">
        {column.orders.length === 0 ? (
          <p className="px-1 py-2 text-[11px] text-muted-slate">
            {t.assignments.noJobsAssigned}
          </p>
        ) : (
          column.orders.map((order) => (
            <AssignmentOrderCard
              key={order.id}
              order={order}
              t={t}
              isRtl={isRtl}
              draggable
            />
          ))
        )}
      </div>
    </div>
  );
}

function AssignmentBoardScrollRow({
  columns,
  visibleCount,
  t,
  isRtl,
  dropTargetKey,
  onDragOverColumn,
  onDropColumn,
}: {
  columns: AssignmentKanbanColumn[];
  visibleCount: 3 | 4;
  t: Dictionary;
  isRtl: boolean;
  dropTargetKey: string | null;
  onDragOverColumn: (column: AssignmentKanbanColumn, event: React.DragEvent) => void;
  onDropColumn: (column: AssignmentKanbanColumn, event: React.DragEvent) => void;
}) {
  if (columns.length === 0) return null;

  const columnWidthClass = assignmentBoardColumnWidthClass(visibleCount);

  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]",
        isRtl && "flex-row-reverse",
      )}
    >
      {columns.map((column) => (
        <AssignmentKanbanColumn
          key={column.key}
          column={column}
          t={t}
          isRtl={isRtl}
          columnWidthClass={columnWidthClass}
          isDropTarget={dropTargetKey === column.key}
          onDragOver={(event) => onDragOverColumn(column, event)}
          onDrop={(event) => onDropColumn(column, event)}
        />
      ))}
    </div>
  );
}

export function AssignmentKanbanBoard({
  data,
  t,
  isRtl,
}: AssignmentKanbanBoardProps) {
  const { showError, showSuccess } = useToast();
  const updateOrder = useUpdateOrderMutation();
  const [dropTargetKey, setDropTargetKey] = useState<string | null>(null);

  const columns = buildAssignmentColumns(data, t);
  const { workerColumns, unassignedColumn } = splitAssignmentBoardRows(columns);

  function handleDragOverColumn(
    column: AssignmentKanbanColumn,
    event: React.DragEvent,
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropTargetKey(column.key);
  }

  async function handleDrop(column: AssignmentKanbanColumn, event: React.DragEvent) {
    event.preventDefault();
    setDropTargetKey(null);

    const orderId = event.dataTransfer.getData("text/order-id");
    if (!orderId) return;

    const assignedToName = column.workerName ?? "";

    try {
      await updateOrder.mutateAsync({
        orderId,
        payload: { assignedToName },
      });
      showSuccess(t.assignments.reassigned);
    } catch {
      showError(t.common.error);
    }
  }

  const hasAnyWork =
    data.assignments.some((row) => row.orderCount > 0) ||
    data.unassignedOrderCount > 0;

  if (!hasAnyWork && data.assignments.length === 0) {
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
    <div className="space-y-3">
      <AssignmentBoardScrollRow
        columns={workerColumns}
        visibleCount={3}
        t={t}
        isRtl={isRtl}
        dropTargetKey={dropTargetKey}
        onDragOverColumn={handleDragOverColumn}
        onDropColumn={(column, event) => void handleDrop(column, event)}
      />

      {unassignedColumn ? (
        <AssignmentBoardScrollRow
          columns={[unassignedColumn]}
          visibleCount={4}
          t={t}
          isRtl={isRtl}
          dropTargetKey={dropTargetKey}
          onDragOverColumn={handleDragOverColumn}
          onDropColumn={(column, event) => void handleDrop(column, event)}
        />
      ) : null}
    </div>
  );
}
