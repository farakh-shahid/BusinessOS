"use client";

import type { OrderWorkflowStatus } from "@shared";
import { Check } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";
import {
  compactPersonName,
  type ProductionStageKey,
} from "@/features/infrastructure/data/order-list-ui";

const STEP_KEYS = ["pending", "cutting", "stitching", "ready", "delivered"] as const;
type StepKey = (typeof STEP_KEYS)[number];

const PRODUCTION_STEPS = new Set<StepKey>(["cutting", "stitching"]);

const STEP_COUNT = STEP_KEYS.length;

function stepIndex(status: OrderWorkflowStatus): number {
  if (status === "delivered") return STEP_COUNT;
  if (status === "cancelled") return -1;
  if (status === "pending") return 0;
  if (status === "cutting") return 1;
  if (status === "stitching") return 2;
  if (status === "ready") return 3;
  return 0;
}

function segmentDone(
  activeIndex: number,
  segmentEndIndex: number,
  cancelled: boolean,
): boolean {
  if (cancelled) return false;
  return activeIndex >= segmentEndIndex;
}

interface OrderWorkflowStepperProps {
  workflowStatus: OrderWorkflowStatus;
  labels: Record<StepKey, string>;
  stageAssignees?: Partial<Record<ProductionStageKey, string>>;
  isRtl?: boolean;
  className?: string;
}

export function OrderWorkflowStepper({
  workflowStatus,
  labels,
  stageAssignees,
  isRtl,
  className,
}: OrderWorkflowStepperProps) {
  const activeIndex = stepIndex(workflowStatus);
  const cancelled = workflowStatus === "cancelled";
  const showAssignees = Boolean(
    stageAssignees?.cutting?.trim() || stageAssignees?.stitching?.trim(),
  );

  return (
    <div
      className={cn(
        "relative w-full border-t border-dashed border-hairline pt-3.5",
        className,
      )}
      aria-label="Order progress"
    >
      <div
        className={cn(
          "relative grid w-full grid-cols-5",
          isRtl && "[direction:rtl]",
        )}
      >
        {STEP_KEYS.map((key, index) => {
          const done = !cancelled && activeIndex > index;
          const current = !cancelled && activeIndex === index;
          const upcoming = cancelled || activeIndex < index;
          const assigneeRaw =
            PRODUCTION_STEPS.has(key) && stageAssignees
              ? stageAssignees[key as ProductionStageKey]
              : undefined;
          const assigneeName = assigneeRaw?.trim() || undefined;

          return (
            <div
              key={key}
              className="flex min-w-0 flex-col items-center gap-1"
            >
              <div className="relative flex h-6 w-full items-center justify-center">
                {index > 0 ? (
                  <div
                    className={cn(
                      "pointer-events-none absolute top-1/2 right-1/2 h-0.5 -translate-y-1/2",
                      segmentDone(activeIndex, index, cancelled)
                        ? "bg-status-ready"
                        : "bg-hairline",
                    )}
                    style={{ left: 0 }}
                    aria-hidden
                  />
                ) : null}
                {index < STEP_COUNT - 1 ? (
                  <div
                    className={cn(
                      "pointer-events-none absolute top-1/2 left-1/2 h-0.5 -translate-y-1/2",
                      segmentDone(activeIndex, index + 1, cancelled)
                        ? "bg-status-ready"
                        : "bg-hairline",
                    )}
                    style={{ right: 0 }}
                    aria-hidden
                  />
                ) : null}

                <span
                  className={cn(
                    "relative z-[1] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold leading-none",
                    done && "border-status-ready bg-status-ready text-white",
                    current &&
                      "border-accent-500 bg-white text-accent-500 shadow-[0_0_0_4px_var(--accent-50)]",
                    upcoming &&
                      "border-hairline bg-background text-muted-slate",
                    cancelled &&
                      "border-hairline bg-background text-muted-slate/70",
                  )}
                >
                  {done ? (
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
              </div>

              <span
                className={cn(
                  "w-full px-0.5 text-center font-semibold leading-tight",
                  showAssignees ? "text-[8.5px]" : "text-[9.5px] sm:text-[10.5px]",
                  "line-clamp-2 whitespace-normal sm:truncate sm:whitespace-nowrap",
                  current && "text-accent-500",
                  done && "text-foreground",
                  (upcoming || cancelled) && "text-muted-slate",
                )}
              >
                {labels[key]}
              </span>

              {showAssignees ? (
                assigneeName ? (
                  <span
                    className={cn(
                      "w-full truncate px-0.5 text-center text-[8px] font-medium leading-tight text-slate-500",
                      current && "text-accent-500/80",
                      done && "text-slate-600",
                    )}
                    title={assigneeName}
                  >
                    {compactPersonName(assigneeName)}
                  </span>
                ) : (
                  <span className="h-[10px]" aria-hidden />
                )
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
