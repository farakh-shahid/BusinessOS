import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "brand" | "violet" | "amber" | "emerald";
  href?: string;
  active?: boolean;
}

const toneStyles = {
  brand: {
    icon: "bg-accent-50 text-accent-500",
    hover: "hover:border-brand-200 hover:shadow-[0_10px_26px_rgba(14,26,54,0.08)]",
  },
  violet: {
    icon: "bg-status-stitching-bg text-status-stitching",
    hover: "hover:border-violet-200 hover:shadow-[0_10px_26px_rgba(14,26,54,0.08)]",
  },
  amber: {
    icon: "bg-status-cutting-bg text-[#9A6800]",
    hover: "hover:border-amber-200 hover:shadow-[0_10px_26px_rgba(14,26,54,0.08)]",
  },
  emerald: {
    icon: "bg-status-ready-bg text-status-ready",
    hover: "hover:border-emerald-200 hover:shadow-[0_10px_26px_rgba(14,26,54,0.08)]",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
  href,
  active = false,
}: StatCardProps) {
  const styles = toneStyles[tone];

  const content = (
    <>
      <div
        className={cn(
          "mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] text-base",
          styles.icon,
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </div>
      <p className="font-display text-[1.6875rem] font-bold leading-none tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-muted-slate sm:text-sm">{label}</p>
    </>
  );

  const className = cn(
    "rounded-[15px] border bg-card px-4 py-4 shadow-sm transition duration-150",
    active ? "border-brand-700 shadow-[0_0_0_1px_var(--brand-700)]" : "border-hairline",
    href &&
      cn(
        "cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]",
        styles.hover,
      ),
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
