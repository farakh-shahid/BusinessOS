import { cn } from "@/core/presentation/lib/utils";
import { BrandMarkIcon } from "./brand-mark-icon";

interface BrandLogoProps {
  solutionsLabel: string;
  isRtl?: boolean;
  className?: string;
}

export function BrandLogo({ solutionsLabel, isRtl, className }: BrandLogoProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-start gap-3",
        isRtl && "flex-row-reverse",
        className,
      )}
    >
      <BrandMarkIcon />

      <div
        className={cn(
          "flex min-w-0 flex-col gap-2",
          isRtl ? "items-end text-right" : "items-start text-left",
        )}
      >
        <p className="font-display text-xl font-bold leading-none tracking-tight">
          <span className="text-white">Business</span>
          <span className="text-accent-500">OS</span>
        </p>
        <span className="inline-flex rounded-full bg-accent-500 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white">
          {solutionsLabel}
        </span>
      </div>
    </div>
  );
}
