import type { ReactNode } from "react";
import { cn } from "@/core/presentation/lib/utils";

interface KvRowProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  isRtl?: boolean;
}

export function KvRow({ label, value, valueClassName, isRtl }: KvRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-hairline py-2 text-[13px] last:border-b-0",
        isRtl && "flex-row-reverse",
      )}
    >
      <span className="text-muted-slate">{label}</span>
      <span className={cn("font-semibold text-foreground", valueClassName)}>
        {value}
      </span>
    </div>
  );
}
