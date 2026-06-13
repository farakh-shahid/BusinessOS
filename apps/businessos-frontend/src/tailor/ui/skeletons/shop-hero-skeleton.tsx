import { Skeleton } from "@/core/presentation/components/ui/skeleton";

interface ShopHeroSkeletonProps {
  variant?: "default" | "dashboard";
}

export function ShopHeroSkeleton({ variant = "default" }: ShopHeroSkeletonProps) {
  const isDashboard = variant === "dashboard";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-sidebar p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/10" />

      {isDashboard ? (
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-3.5 w-28 bg-white/30" />
            <Skeleton className="h-8 w-56 max-w-full bg-white/45 sm:h-9" />
            <Skeleton className="h-3.5 w-full max-w-md bg-white/25" />
          </div>
          <Skeleton className="h-11 w-full shrink-0 rounded-2xl bg-accent-500/30 sm:w-36" />
        </div>
      ) : (
        <div className="relative space-y-3">
          <Skeleton className="h-3 w-32 bg-white/40" />
          <Skeleton className="h-8 w-56 max-w-full bg-white/50 sm:h-9" />
          <Skeleton className="h-3 w-24 bg-white/35" />
        </div>
      )}
    </div>
  );
}
