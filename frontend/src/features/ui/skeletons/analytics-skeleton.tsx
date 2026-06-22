import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { SkeletonCard, SkeletonLine } from "./skeleton-primitives";
import { ShopHeroSkeleton } from "./shop-hero-skeleton";

function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-5 shadow-sm">
      <Skeleton className="mb-4 h-11 w-11 rounded-xl" />
      <Skeleton className="h-8 w-20 rounded-lg" />
      <SkeletonLine width="1/2" className="mt-2 h-3" />
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-5" aria-busy aria-label="Loading analytics">
      <ShopHeroSkeleton showAction={false} />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonCard className="h-64">
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="mt-6 h-44 w-full rounded-xl" />
        </SkeletonCard>
        <SkeletonCard className="h-64">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="mt-6 h-44 w-full rounded-xl" />
        </SkeletonCard>
      </div>
    </div>
  );
}
