"use client";

import type { OrderWorkflowStatus } from "@business-os/tailor";
import { Check } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

const STEP_KEYS = ["pending", "cutting", "stitching", "ready", "delivered"] as const;
type StepKey = (typeof STEP_KEYS)[number];

const STEP_COUNT = STEP_KEYS.length;
const TRACK_INSET = "12.5%";
/** Circle row: pt-3.5 (14px) + half of h-5 (10px) */
const TRACK_TOP = "1.5rem";

function stepIndex(status: OrderWorkflowStatus): number {
  if (status === "delivered") return STEP_COUNT;
  if (status === "cancelled") return -1;
  if (status === "pending") return 0;
  if (status === "cutting") return 1;
  if (status === "stitching") return 2;
  if (status === "ready") return 3;
  return 0;
}

interface OrderWorkflowStepperProps {
  workflowStatus: OrderWorkflowStatus;
  labels: Record<StepKey, string>;
  isRtl?: boolean;
  className?: string;
}

export function OrderWorkflowStepper({
  workflowStatus,
  labels,
  isRtl,
  className,
}: OrderWorkflowStepperProps) {
  const activeIndex = stepIndex(workflowStatus);
  const cancelled = workflowStatus === "cancelled";

  const progressRatio = cancelled
    ? 0
    : Math.min(Math.max(activeIndex, 0), STEP_COUNT - 1) / (STEP_COUNT - 1);

  return (
    <div
      className={cn(
        "relative w-full border-t border-dashed border-hairline pt-3.5",
        className,
      )}
      aria-label="Order progress"
    >
      {/* Shared connector track behind circles */}
      <div
        className="pointer-events-none absolute h-0.5 -translate-y-1/2 bg-hairline"
        style={{
          top: TRACK_TOP,
          left: TRACK_INSET,
          right: TRACK_INSET,
        }}
        aria-hidden
      />
      {!cancelled && progressRatio > 0 ? (
        <div
          className="pointer-events-none absolute h-0.5 -translate-y-1/2 bg-status-ready transition-[width] duration-200"
          style={{
            top: TRACK_TOP,
            left: isRtl ? undefined : TRACK_INSET,
            right: isRtl ? TRACK_INSET : undefined,
            width: `calc((100% - 2 * ${TRACK_INSET}) * ${progressRatio})`,
          }}
          aria-hidden
        />
      ) : null}

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

          return (
            <div
              key={key}
              className="flex min-w-0 flex-col items-center gap-1.5"
            >
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
              <span
                className={cn(
                  "w-full px-0.5 text-center text-[9.5px] font-semibold leading-tight sm:text-[10.5px]",
                  current && "text-accent-500",
                  done && "text-foreground",
                  (upcoming || cancelled) && "text-muted-slate",
                )}
              >
                {labels[key]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
