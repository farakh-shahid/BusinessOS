import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { SkeletonCard, SkeletonCircle, SkeletonLine, SkeletonPageHeader } from "./skeleton-primitives";

export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy aria-label="Loading order">
      <SkeletonPageHeader />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <SkeletonCircle size="lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 rounded-md" />
            <SkeletonLine width="1/3" className="h-3" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonCard className="space-y-4">
          <Skeleton className="h-5 w-32 rounded-md" />
          <SkeletonLine width="full" />
          <SkeletonLine width="3/4" />
          <SkeletonLine width="1/2" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </SkeletonCard>
        <SkeletonCard className="space-y-4">
          <Skeleton className="h-5 w-28 rounded-md" />
          <SkeletonLine width="full" />
          <SkeletonLine width="full" />
          <SkeletonLine width="2/3" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </SkeletonCard>
      </div>
    </div>
  );
}

export function DialogContentSkeleton() {
  return (
    <div className="space-y-4 py-2" aria-busy aria-label="Loading">
      <SkeletonLine width="3/4" />
      <SkeletonLine width="full" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}
