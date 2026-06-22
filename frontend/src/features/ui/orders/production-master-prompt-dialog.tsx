"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { Button } from "@/core/presentation/components/ui/button";
import { cn } from "@/core/presentation/lib/utils";
import { AssignWorkerSelect } from "@/features/ui/orders/assign-worker-select";

interface ProductionMasterPromptDialogProps {
  open: boolean;
  stage: "cutting" | "stitching";
  assignees: string[];
  assigneeWorkload?: Record<string, number>;
  defaultCuttingMaster?: string;
  disabled?: boolean;
  onClose: () => void;
  onConfirm: (masterName: string) => void;
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
  disabled,
  onClose,
  onConfirm,
  onSkip,
  t,
  isRtl,
}: ProductionMasterPromptDialogProps) {
  const [masterName, setMasterName] = useState("");

  useEffect(() => {
    if (!open) return;
    setMasterName(
      stage === "stitching" && defaultCuttingMaster?.trim()
        ? defaultCuttingMaster.trim()
        : "",
    );
  }, [defaultCuttingMaster, open, stage]);

  if (!open) return null;

  const title =
    stage === "cutting"
      ? t.orderDetail.assignCuttingMaster
      : t.orderDetail.assignStitchingMaster;
  const hint =
    stage === "cutting"
      ? t.orderDetail.assignCuttingMasterHint
      : t.orderDetail.assignStitchingMasterHint;

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

        <AssignWorkerSelect
          value={masterName}
          assignees={assignees}
          assigneeWorkload={assigneeWorkload}
          disabled={disabled}
          onChange={setMasterName}
          t={t}
          isRtl={isRtl}
        />

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
            disabled={disabled || !masterName.trim()}
            onClick={() => onConfirm(masterName.trim())}
          >
            {t.orderDetail.confirmMasterAssign}
          </Button>
        </div>
      </div>
    </div>
  );
}
