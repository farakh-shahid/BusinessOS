import type { ReactNode } from "react";
import { cn } from "@/core/presentation/lib/utils";

interface OrderDetailPanelProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  isRtl?: boolean;
}

export function OrderDetailPanel({
  title,
  action,
  children,
  className,
  isRtl,
}: OrderDetailPanelProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-hairline bg-card px-4 py-[18px] shadow-sm sm:px-5",
        className,
      )}
    >
      {title ? (
        <div
          className={cn(
            "mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3",
            isRtl && "sm:flex-row-reverse",
          )}
        >
          <h2 className="font-display text-[15px] font-bold text-foreground">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
