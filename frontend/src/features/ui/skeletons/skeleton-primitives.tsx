import { cn } from "@/core/presentation/lib/utils";
import { Skeleton } from "@/core/presentation/components/ui/skeleton";

export function SkeletonCircle({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-9 w-9",
    md: "h-11 w-11",
    lg: "h-14 w-14",
  };

  return <Skeleton className={cn("shrink-0 rounded-full", sizes[size], className)} />;
}

export function SkeletonLine({
  className,
  width = "full",
}: {
  className?: string;
  width?: "full" | "3/4" | "2/3" | "1/2" | "1/3" | "1/4";
}) {
  const widths = {
    full: "w-full",
    "3/4": "w-3/4",
    "2/3": "w-2/3",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
    "1/4": "w-1/4",
  };

  return (
    <Skeleton className={cn("h-3.5 rounded-md", widths[width], className)} />
  );
}

export function SkeletonCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SkeletonPageHeader() {
  return (
    <div className="mb-4 space-y-2">
      <SkeletonLine width="1/4" className="h-3" />
      <Skeleton className="h-7 w-48 max-w-full rounded-lg" />
      <SkeletonLine width="1/2" className="h-3" />
    </div>
  );
}
