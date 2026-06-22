"use client";

import { cn } from "@/core/presentation/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  isRtl?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  meta,
  isRtl,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-4 sm:mb-5 sm:flex-row sm:items-end sm:justify-between",
        isRtl && "sm:flex-row-reverse",
        className,
      )}
    >
      <div className={cn("min-w-0", isRtl && "text-right")}>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-[1.4375rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-slate">{subtitle}</p>
        ) : null}
        {meta ? <div className="mt-2">{meta}</div> : null}
      </div>
      {actions ? (
        <div
          className={cn(
            "flex shrink-0 flex-wrap items-center gap-2",
            isRtl && "flex-row-reverse justify-end",
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
