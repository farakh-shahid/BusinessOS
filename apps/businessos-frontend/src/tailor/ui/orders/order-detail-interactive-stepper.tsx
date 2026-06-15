"use client";

import { Check } from "lucide-react";
import type { OrderWorkflowStatus } from "@business-os/tailor";
import { cn } from "@/core/presentation/lib/utils";

const STEP_KEYS = ["pending", "cutting", "stitching", "ready"] as const;
type StepKey = (typeof STEP_KEYS)[number];

const TRACK_TOP = "1.625rem";

function stepIndex(status: OrderWorkflowStatus): number {
  if (status === "delivered") return STEP_KEYS.length;
  if (status === "cancelled") return -1;
  if (status === "pending") return 0;
  if (status === "cutting") return 1;
  if (status === "stitching") return 2;
  if (status === "ready") return 3;
  return 0;
}

interface OrderDetailInteractiveStepperProps {
  workflowStatus: OrderWorkflowStatus;
  labels: Record<StepKey, string>;
  hint: string;
  editable?: boolean;
  isRtl?: boolean;
  onStageChange?: (status: StepKey) => void;
}

export function OrderDetailInteractiveStepper({
  workflowStatus,
  labels,
  hint,
  editable = false,
  isRtl,
  onStageChange,
}: OrderDetailInteractiveStepperProps) {
  const activeIndex = stepIndex(workflowStatus);
  const cancelled = workflowStatus === "cancelled";
  const progressRatio = cancelled
    ? 0
    : Math.min(Math.max(activeIndex, 0), STEP_KEYS.length - 1) /
      (STEP_KEYS.length - 1);

  return (
    <div>
      <div
        className="relative flex items-start px-1 py-1.5"
        aria-label="Order progress"
      >
        <div
          className="pointer-events-none absolute h-0.5 -translate-y-1/2 bg-hairline"
          style={{ top: TRACK_TOP, left: "12.5%", right: "12.5%" }}
          aria-hidden
        />
        {!cancelled && progressRatio > 0 ? (
          <div
            className="pointer-events-none absolute h-0.5 -translate-y-1/2 bg-status-ready transition-[width] duration-200"
            style={{
              top: TRACK_TOP,
              left: isRtl ? undefined : "12.5%",
              right: isRtl ? "12.5%" : undefined,
              width: `calc(75% * ${progressRatio})`,
            }}
            aria-hidden
          />
        ) : null}

        {STEP_KEYS.map((key, index) => {
          const done = !cancelled && activeIndex > index;
          const current = !cancelled && activeIndex === index;
          const upcoming = cancelled || activeIndex < index;

          return (
            <button
              key={key}
              type="button"
              disabled={!editable || cancelled}
              onClick={() => editable && onStageChange?.(key)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1.5 border-none bg-transparent p-0",
                editable && !cancelled && "cursor-pointer",
                !editable && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "relative z-[1] grid h-[26px] w-[26px] place-items-center rounded-full border-2 text-xs font-bold transition-all",
                  done && "border-status-ready bg-status-ready text-white",
                  current &&
                    "border-accent-500 bg-white text-accent-500 shadow-[0_0_0_5px_var(--color-accent-50)]",
                  upcoming &&
                    "border-hairline bg-background text-muted-slate",
                  cancelled &&
                    "border-hairline bg-background text-muted-slate/70",
                )}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "max-w-[4.25rem] truncate text-center text-[10px] font-semibold leading-tight sm:max-w-none sm:text-xs",
                  current && "text-accent-500",
                  done && "text-foreground",
                  (upcoming || cancelled) && "text-muted-slate",
                )}
              >
                {labels[key]}
              </span>
            </button>
          );
        })}
      </div>
      <p
        className={cn(
          "mt-3 text-center text-[11.5px] text-muted-slate",
          isRtl && "text-right sm:text-center",
        )}
      >
        {hint}
      </p>
    </div>
  );
}

export function nextWorkflowStage(
  status: OrderWorkflowStatus,
): StepKey | null {
  switch (status) {
    case "pending":
      return "cutting";
    case "cutting":
      return "stitching";
    case "stitching":
      return "ready";
    default:
      return null;
  }
}
