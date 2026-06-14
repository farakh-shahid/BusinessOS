import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { cn } from "@/core/presentation/lib/utils";

interface ShopHeroSkeletonProps {
  variant?: "default" | "dashboard";
  showAction?: boolean;
}

export function ShopHeroSkeleton({
  variant = "default",
  showAction = true,
}: ShopHeroSkeletonProps) {
  const isDashboard = variant === "dashboard";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-sidebar p-6 shadow-lg shadow-sidebar-dark/20 sm:p-8",
        isDashboard ? "rounded-[18px]" : "rounded-[18px]",
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/10" />

      {isDashboard ? (
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-3.5 w-28 bg-white/30" />
            <Skeleton className="h-8 w-56 max-w-full bg-white/45 sm:h-9" />
            <Skeleton className="h-3.5 w-40 max-w-full bg-white/25" />
          </div>
          {showAction ? (
            <Skeleton className="h-11 w-full shrink-0 rounded-2xl bg-accent-500/30 sm:w-36" />
          ) : null}
        </div>
      ) : (
        <div
          className={cn(
            "relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between",
          )}
        >
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-4 w-20 rounded-full bg-white/30" />
            <Skeleton className="h-3.5 w-32 bg-white/30" />
            <Skeleton className="h-8 w-56 max-w-full bg-white/50 sm:h-9" />
            <Skeleton className="h-3 w-24 bg-white/35" />
          </div>
          {showAction ? (
            <Skeleton className="h-11 w-full shrink-0 rounded-2xl bg-accent-500/30 sm:w-36" />
          ) : (
            <Skeleton className="hidden h-14 w-14 shrink-0 rounded-2xl bg-white/10 sm:block" />
          )}
        </div>
      )}
    </div>
  );
}
