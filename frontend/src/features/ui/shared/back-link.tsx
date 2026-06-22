import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

interface BackLinkProps {
  href: string;
  label: string;
  isRtl?: boolean;
  className?: string;
}

export function BackLink({ href, label, isRtl, className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-slate transition hover:text-brand-700 sm:text-[13px]",
        isRtl && "flex-row-reverse",
        className,
      )}
    >
      <ArrowLeft className={cn("h-3.5 w-3.5", isRtl && "rotate-180")} />
      {label}
    </Link>
  );
}
