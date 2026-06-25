"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { cn } from "@/core/presentation/lib/utils";
import { AssignWorkerSelect } from "@/features/ui/orders/assign-worker-select";

export interface MasterAssignmentResult {
  cuttingMasterName?: string;
  stitchingMasterName?: string;
}

interface ProductionMasterPromptDialogProps {
  open: boolean;
  /** "cutting"/"stitching" prompt a single master; "finalize" prompts both missing masters. */
  stage: "cutting" | "stitching" | "finalize";
  assignees: string[];
  assigneeWorkload?: Record<string, number>;
  defaultCuttingMaster?: string;
  defaultStitchingMaster?: string;
  disabled?: boolean;
  onClose: () => void;
  onConfirm: (result: MasterAssignmentResult) => void;
  onSkip: () => void;
  t: Dictionary;
  isRtl?: boolean;
}

export function ProductionMasterPromptDialog({
  open,
  stage,
  assignees,
  assigneeWorkload,
  defaultCuttingMaster,
  defaultStitchingMaster,
  disabled,
  onClose,
  onConfirm,
  onSkip,
  t,
  isRtl,
}: ProductionMasterPromptDialogProps) {
  const isFinalize = stage === "finalize";
  const [masterName, setMasterName] = useState("");
  const [cuttingName, setCuttingName] = useState("");
  const [stitchingName, setStitchingName] = useState("");

  useEffect(() => {
    if (!open) return;
    setCuttingName(defaultCuttingMaster?.trim() ?? "");
    setStitchingName(
      defaultStitchingMaster?.trim() ||
        (defaultCuttingMaster?.trim() ?? ""),
    );
    setMasterName(
      stage === "stitching" && defaultCuttingMaster?.trim()
        ? defaultCuttingMaster.trim()
        : "",
    );
  }, [defaultCuttingMaster, defaultStitchingMaster, open, stage]);

  if (!open) return null;

  const title = isFinalize
    ? t.orderDetail.assignMastersTitle
    : stage === "cutting"
      ? t.orderDetail.assignCuttingMaster
      : t.orderDetail.assignStitchingMaster;
  const hint = isFinalize
    ? t.orderDetail.assignMastersHint
    : stage === "cutting"
      ? t.orderDetail.assignCuttingMasterHint
      : t.orderDetail.assignStitchingMasterHint;

  const canConfirm = isFinalize
    ? Boolean(cuttingName.trim() || stitchingName.trim())
    : Boolean(masterName.trim());

  function handleConfirm() {
    if (isFinalize) {
      onConfirm({
        cuttingMasterName: cuttingName.trim() || undefined,
        stitchingMasterName: stitchingName.trim() || undefined,
      });
      return;
    }
    onConfirm(
      stage === "cutting"
        ? { cuttingMasterName: masterName.trim() }
        : { stitchingMasterName: masterName.trim() },
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 pb-24 sm:items-center sm:pb-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "w-full max-w-md rounded-2xl bg-white p-5 shadow-xl",
          isRtl && "text-right",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={cn(
            "mb-4 flex items-start justify-between gap-3",
            isRtl && "flex-row-reverse",
          )}
        >
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-slate">{hint}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-slate transition hover:bg-slate-100"
            aria-label={t.form.cancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isFinalize ? (
          <div className="space-y-4">
            <div>
              <p
                className={cn(
                  "mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-slate",
                  isRtl && "text-right",
                )}
              >
                {t.orderDetail.cuttingMaster}
              </p>
              <AssignWorkerSelect
                value={cuttingName}
                assignees={assignees}
                assigneeWorkload={assigneeWorkload}
                disabled={disabled}
                onChange={setCuttingName}
                t={t}
                isRtl={isRtl}
              />
            </div>
            <div>
              <p
                className={cn(
                  "mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-slate",
                  isRtl && "text-right",
                )}
              >
                {t.orderDetail.stitchingMaster}
              </p>
              <AssignWorkerSelect
                value={stitchingName}
                assignees={assignees}
                assigneeWorkload={assigneeWorkload}
                disabled={disabled}
                onChange={setStitchingName}
                t={t}
                isRtl={isRtl}
              />
            </div>
          </div>
        ) : (
          <AssignWorkerSelect
            value={masterName}
            assignees={assignees}
            assigneeWorkload={assigneeWorkload}
            disabled={disabled}
            onChange={setMasterName}
            t={t}
            isRtl={isRtl}
          />
        )}

        <div
          className={cn(
            "mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
            isRtl && "sm:flex-row-reverse",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            onClick={onSkip}
          >
            {t.orderDetail.skipMasterAssign}
          </Button>
          <Button
            type="button"
            disabled={disabled || !canConfirm}
            onClick={handleConfirm}
          >
            {t.orderDetail.confirmMasterAssign}
          </Button>
        </div>
      </div>
    </div>
  );
}
