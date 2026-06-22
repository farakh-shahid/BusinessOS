import Link from "next/link";
import { cn } from "@/core/presentation/lib/utils";

interface SectionHeaderProps {
  title: string;
  linkHref?: string;
  linkLabel?: string;
  isRtl?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  linkHref,
  linkLabel,
  isRtl,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-3 flex items-center justify-between gap-3",
        isRtl && "flex-row-reverse",
        className,
      )}
    >
      <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
      {linkHref && linkLabel ? (
        <Link
          href={linkHref}
          className="shrink-0 text-xs font-semibold text-accent-500 hover:underline sm:text-[13px]"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
