import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "brand" | "violet" | "amber" | "emerald";
  href?: string;
}

const toneStyles = {
  brand: {
    icon: "bg-brand-50 text-brand-700 ring-brand-100",
    hover: "hover:border-brand-200 hover:shadow-brand-700/5",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 ring-violet-100",
    hover: "hover:border-violet-200 hover:shadow-violet-500/5",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 ring-amber-100",
    hover: "hover:border-amber-200 hover:shadow-amber-500/5",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    hover: "hover:border-emerald-200 hover:shadow-emerald-500/5",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "brand",
  href,
}: StatCardProps) {
  const styles = toneStyles[tone];

  const content = (
    <>
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-4",
          styles.icon,
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="min-w-0 text-center md:text-left">
        <p className="text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem]">
          {value}
        </p>
        <p className="mt-0.5 text-xs font-medium leading-snug text-slate-500 md:text-sm">
          {label}
        </p>
      </div>
    </>
  );

  const className = cn(
    "flex flex-col items-center gap-3 rounded-2xl border border-slate-100/80 bg-white px-4 py-4 shadow-sm md:flex-row md:gap-4 md:px-5 md:py-5",
    href &&
      cn(
        "cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]",
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
