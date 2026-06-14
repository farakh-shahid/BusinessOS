import { cn } from "@/core/presentation/lib/utils";

interface DashboardSectionLabelProps {
  children: React.ReactNode;
  className?: string;
  isRtl?: boolean;
}

export function DashboardSectionLabel({
  children,
  className,
  isRtl,
}: DashboardSectionLabelProps) {
  return (
    <p
      className={cn(
        "mx-0.5 mb-3 mt-6 text-[10.5px] font-bold uppercase tracking-[0.13em] text-muted-slate first:mt-0",
        isRtl && "text-right",
        className,
      )}
    >
      {children}
    </p>
  );
}
