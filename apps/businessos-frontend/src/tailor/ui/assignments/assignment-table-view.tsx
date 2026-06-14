"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import type { AssignmentsOverview } from "@business-os/tailor";
import type { Dictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { cn } from "@/core/presentation/lib/utils";
import {
  flattenAssignmentOrders,
} from "@/tailor/infrastructure/data/assignment-board-utils";
import { OrderWorkflowStatusBadge } from "@/tailor/ui/orders/order-workflow-status-badge";

interface AssignmentTableViewProps {
  data: AssignmentsOverview;
  t: Dictionary;
  isRtl: boolean;
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
    <div className="overflow-hidden rounded-[15px] border border-hairline bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-slate-50/80">
              {[
                t.assignments.columnWorker,
                t.assignments.columnCustomer,
                t.assignments.columnOrder,
                t.assignments.columnDetails,
                t.assignments.columnStatus,
                t.assignments.columnDue,
              ].map((label) => (
                <th
                  key={label}
                  scope="col"
                  className={cn(
                    "px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-slate",
                    isRtl && "text-right",
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-hairline last:border-b-0 hover:bg-slate-50/60"
                >
                  <td
                    className={cn(
                      "px-4 py-3 text-sm font-medium text-foreground",
                      isRtl && "text-right",
                    )}
                  >
                    {row.assignedLabel}
                  </td>
                  <td className={cn("px-4 py-3", isRtl && "text-right")}>
                    <Link
                      href={routes.orderDetail(row.id)}
                      className={cn(
                        "inline-flex flex-wrap items-center gap-1.5 font-semibold text-foreground hover:text-brand-700 hover:underline",
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
                    </Link>
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 font-display text-sm text-muted-slate",
                      isRtl && "text-right",
                    )}
                  >
                    #{row.orderNumber}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-sm text-muted-slate",
                      isRtl && "text-right",
                    )}
                  >
                    {row.suitCount}x {row.garmentLabel}
                  </td>
                  <td className={cn("px-4 py-3", isRtl && "text-right")}>
                    <OrderWorkflowStatusBadge
                      workflowStatus={row.workflowStatus}
                      t={t}
                    />
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-sm text-muted-slate",
                      isRtl && "text-right",
                    )}
                    dir="ltr"
                  >
                    {row.dueDate}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
