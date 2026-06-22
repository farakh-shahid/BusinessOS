"use client";

import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";
import type { AssignmentsOverview } from "@shared";
import type { Dictionary } from "@/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import { flattenAssignmentOrders } from "@/features/infrastructure/data/assignment-board-utils";
import { OrderWorkflowStatusBadge } from "@/features/ui/orders/order-workflow-status-badge";

interface AssignmentTableViewProps {
  data: AssignmentsOverview;
  t: Dictionary;
  isRtl: boolean;
}

type AssignmentOrderRow = ReturnType<typeof flattenAssignmentOrders>[number];

function AssignmentOrderCard({
  row,
  t,
  isRtl,
}: {
  row: AssignmentOrderRow;
  t: Dictionary;
  isRtl: boolean;
}) {
  return (
    <Link
      href={routes.orderDetail(row.id)}
      className={cn(
        "group flex h-full flex-col rounded-[13px] border border-hairline bg-card p-4 transition-all hover:border-brand-200 hover:shadow-md",
        isRtl && "text-right",
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-start justify-between gap-2",
          isRtl && "flex-row-reverse",
        )}
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-slate">
            {row.assignedLabel}
          </p>
          <p
            className={cn(
              "mt-0.5 flex flex-wrap items-center gap-1.5 font-semibold text-foreground",
              isRtl && "flex-row-reverse justify-end",
            )}
          >
            {row.customerName}
            {row.isRush ? (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full bg-status-urgent-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-status-urgent",
                  isRtl && "flex-row-reverse",
                )}
              >
                <Zap className="h-2.5 w-2.5" />
                {t.orderDetail.rush}
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 font-display text-xs text-brand-700">
            #{row.orderNumber}
          </p>
        </div>
        <OrderWorkflowStatusBadge workflowStatus={row.workflowStatus} t={t} />
      </div>

      <p className="mt-3 text-sm text-muted-slate">
        {row.suitCount}x {row.garmentLabel}
      </p>

      <div
        className={cn(
          "mt-auto flex items-center justify-between border-t border-hairline pt-3",
          isRtl && "flex-row-reverse",
        )}
      >
        <p className="text-xs text-muted-slate" dir="ltr">
          {t.assignments.columnDue}: {row.dueDate}
        </p>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-brand-700 transition-transform group-hover:translate-x-0.5",
            isRtl && "rotate-180 group-hover:-translate-x-0.5",
          )}
        />
      </div>
    </Link>
  );
}

export function AssignmentTableView({
  data,
  t,
  isRtl,
}: AssignmentTableViewProps) {
  const rows = flattenAssignmentOrders(data, t);

  if (rows.length === 0) {
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
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-0.5",
          isRtl && "flex-row-reverse",
        )}
      >
        <h3 className="font-display text-sm font-bold text-foreground">
          {t.assignments.performanceOrdersHeading}
        </h3>
        <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-slate ring-1 ring-hairline">
          {rows.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <AssignmentOrderCard key={row.id} row={row} t={t} isRtl={isRtl} />
        ))}
      </div>
    </div>
  );
}
