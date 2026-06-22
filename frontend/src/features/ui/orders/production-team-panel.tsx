"use client";

import type { OrderFullDetail, OrderWorkflowStatus } from "@shared";
import type { Dictionary } from "@/i18n";
import { Check, Scissors, Shirt, UserRound } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";
import { PersonNameText } from "@/core/presentation/components/ui/person-name-text";
import { AssignWorkerSelect } from "@/features/ui/orders/assign-worker-select";
import { OrderWorkflowStepper } from "@/features/ui/orders/order-workflow-stepper";

interface ProductionTeamPanelProps {
  order: OrderFullDetail;
  assignees: string[];
  assigneeWorkload?: Record<string, number>;
  editable: boolean;
  disabled?: boolean;
  onUpdate: (payload: {
    cuttingMasterName?: string;
    stitchingMasterName?: string;
  }) => void;
  t: Dictionary;
  isRtl?: boolean;
}

function stageActive(
  workflowStatus: OrderWorkflowStatus,
  stage: "booked" | "cutting" | "stitching",
): boolean {
  if (workflowStatus === "cancelled") return false;
  if (stage === "booked") return workflowStatus === "pending";
  if (stage === "cutting") return workflowStatus === "cutting";
  return workflowStatus === "stitching";
}

function stageComplete(
  workflowStatus: OrderWorkflowStatus,
  stage: "booked" | "cutting" | "stitching",
): boolean {
  if (workflowStatus === "cancelled") return false;
  if (stage === "booked") return workflowStatus !== "pending";
  if (stage === "cutting") {
    return (
      workflowStatus === "stitching" ||
      workflowStatus === "ready" ||
      workflowStatus === "delivered"
    );
  }
  return workflowStatus === "ready" || workflowStatus === "delivered";
}

const compactSelectClass =
  "min-h-11 w-full rounded-xl text-sm font-medium";

function ProductionStageRow({
  stage,
  workflowStatus,
  title,
  hint,
  name,
  editable,
  disabled,
  assignees,
  assigneeWorkload,
  onAssign,
  lastOrderLink,
  icon: Icon,
  t,
  isRtl,
}: {
  stage: "booked" | "cutting" | "stitching";
  workflowStatus: OrderWorkflowStatus;
  title: string;
  hint: string;
  name?: string;
  editable: boolean;
  disabled?: boolean;
  assignees: string[];
  assigneeWorkload?: Record<string, number>;
  onAssign?: (name: string) => void;
  lastOrderLink?: { label: string; onClick: () => void };
  icon: typeof UserRound;
  t: Dictionary;
  isRtl?: boolean;
}) {
  const active = stageActive(workflowStatus, stage);
  const complete = stageComplete(workflowStatus, stage);
  const hasName = Boolean(name?.trim());

  let statusLabel = t.orderDetail.stageNotStarted;
  if (complete && !hasName && stage !== "booked") {
    statusLabel = t.orderDetail.stageNotRecorded;
  } else if (complete) {
    statusLabel = t.orderDetail.stageFinished;
  } else if (active) {
    statusLabel = t.orderDetail.stageCurrent;
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-3.5 sm:p-4",
        active
          ? "border-brand-500 bg-brand-50 shadow-sm ring-2 ring-brand-100 ring-inset"
          : "border-hairline bg-background",
        !active && complete && hasName && "border-emerald-200/80 bg-emerald-50/30",
        isRtl && "text-right",
      )}
    >
      <div
        className={cn(
          "flex items-start gap-3",
          isRtl && "flex-row-reverse",
        )}
      >
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            active && "bg-brand-600 text-white",
            !active && complete && hasName && "bg-emerald-100 text-emerald-700",
            !active && !complete && "bg-slate-100 text-slate-500",
            !active && complete && !hasName && stage !== "booked" && "bg-slate-100 text-slate-400",
          )}
        >
          {complete && hasName ? (
            <Check className="h-5 w-5" strokeWidth={2.5} />
          ) : (
            <Icon className="h-5 w-5" strokeWidth={2} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
              isRtl && "sm:flex-row-reverse",
            )}
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-slate">
                {hint}
              </p>
            </div>
            <span
              className={cn(
                "w-fit shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                active && "bg-brand-600 text-white",
                !active && complete && hasName && "bg-emerald-100 text-emerald-800",
                !active && complete && !hasName && stage !== "booked" && "bg-slate-100 text-slate-600",
                !active && !complete && "bg-slate-100 text-slate-500",
              )}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 min-w-0">
        {editable && onAssign && stage !== "booked" ? (
          <div className="space-y-1.5">
            <AssignWorkerSelect
              value={name ?? ""}
              assignees={assignees}
              assigneeWorkload={assigneeWorkload}
              disabled={disabled}
              onChange={onAssign}
              t={t}
              isRtl={isRtl}
              plainButton
              buttonClassName={compactSelectClass}
            />
            {lastOrderLink ? (
              <button
                type="button"
                disabled={disabled}
                onClick={lastOrderLink.onClick}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800 disabled:opacity-50"
              >
                {lastOrderLink.label}
              </button>
            ) : null}
          </div>
        ) : hasName ? (
          <p className="text-base font-semibold text-foreground">
            <PersonNameText name={name!.trim()} />
          </p>
        ) : (
          <p className="text-sm text-muted-slate">
            {t.orderDetail.stageUnassigned}
          </p>
        )}
      </div>
    </div>
  );
}

export function ProductionTeamPanel({
  order,
  assignees,
  assigneeWorkload,
  editable,
  disabled,
  onUpdate,
  t,
  isRtl,
}: ProductionTeamPanelProps) {
  const lastStitching = order.customerLastStitchingMasterName?.trim();

  const stepperLabels = {
    pending: t.orderStatus.pending,
    cutting: t.orderStatus.cutting,
    stitching: t.orderStatus.stitching,
    ready: t.orderStatus.ready,
    delivered: t.orderStatus.delivered,
  };

  const hasTeam =
    order.bookedByName?.trim() ||
    order.cuttingMasterName?.trim() ||
    order.stitchingMasterName?.trim();

  return (
    <div className="space-y-4">
      <OrderWorkflowStepper
        workflowStatus={order.workflowStatus}
        labels={stepperLabels}
        isRtl={isRtl}
        className="border-t-0 pt-1"
      />

      <div className="space-y-1">
        <p
          className={cn(
            "px-0.5 text-sm font-bold text-foreground",
            isRtl && "text-right",
          )}
        >
          {t.orderDetail.progressTeamHeading}
        </p>
        <div className="space-y-2.5">
          <ProductionStageRow
            stage="booked"
            workflowStatus={order.workflowStatus}
            title={t.orderDetail.bookedBy}
            hint={t.orderDetail.stageBookedHint}
            name={order.bookedByName}
            editable={false}
            assignees={assignees}
            icon={UserRound}
            t={t}
            isRtl={isRtl}
          />
          <ProductionStageRow
            stage="cutting"
            workflowStatus={order.workflowStatus}
            title={t.orderDetail.cuttingMaster}
            hint={t.orderDetail.stageCuttingHint}
            name={order.cuttingMasterName}
            editable={editable}
            disabled={disabled}
            assignees={assignees}
            assigneeWorkload={assigneeWorkload}
            onAssign={(name) => onUpdate({ cuttingMasterName: name })}
            icon={Scissors}
            t={t}
            isRtl={isRtl}
          />
          <ProductionStageRow
            stage="stitching"
            workflowStatus={order.workflowStatus}
            title={t.orderDetail.stitchingMaster}
            hint={t.orderDetail.stageStitchingHint}
            name={order.stitchingMasterName}
            editable={editable}
            disabled={disabled}
            assignees={assignees}
            assigneeWorkload={assigneeWorkload}
            onAssign={(name) => onUpdate({ stitchingMasterName: name })}
            lastOrderLink={
              editable && lastStitching
                ? {
                    label: t.orderDetail.sameAsLastOrder,
                    onClick: () =>
                      onUpdate({ stitchingMasterName: lastStitching }),
                  }
                : undefined
            }
            icon={Shirt}
            t={t}
            isRtl={isRtl}
          />
        </div>
      </div>

      {!editable && !hasTeam ? (
        <p className="text-center text-sm text-muted-slate">
          {t.orderDetail.productionTeamEmpty}
        </p>
      ) : null}
    </div>
  );
}
