"use client";

import { cn } from "@/core/presentation/lib/utils";

export function SectionTitle({
  children,
  isRtl,
}: {
  children: React.ReactNode;
  isRtl: boolean;
}) {
  return (
    <p
      className={cn(
        "mb-3 mt-6 text-[10.5px] font-bold uppercase tracking-[0.13em] text-muted-slate",
        isRtl && "text-right",
      )}
    >
      {children}
    </p>
  );
}

export function AnalyticsPanel({
  title,
  hint,
  action,
  children,
  isRtl,
  fill,
  className,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  isRtl?: boolean;
  fill?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-card p-4 sm:p-[18px]",
        fill && "flex h-full min-h-0 flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "mb-3 flex items-center justify-between gap-3",
          isRtl && "flex-row-reverse",
          fill && "shrink-0",
        )}
      >
        <div className={cn("min-w-0", isRtl && "text-right")}>
          <h3 className="font-display text-sm font-bold text-foreground">{title}</h3>
          {hint ? (
            <p className="mt-0.5 text-[11px] text-muted-slate">{hint}</p>
          ) : null}
        </div>
        {action}
      </div>
      {fill ? (
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      ) : (
        children
      )}
    </div>
  );
}
