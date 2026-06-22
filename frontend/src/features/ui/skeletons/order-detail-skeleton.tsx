import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { SkeletonCard, SkeletonLine } from "./skeleton-primitives";

export function OrderDetailSkeleton() {
  return (
    <div className="space-y-3.5" aria-busy aria-label="Loading order">
      <Skeleton className="h-4 w-32 rounded-md" />

      <SkeletonCard className="space-y-4 p-5">
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-[54px] w-[54px] rounded-[14px]" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-md" />
            <SkeletonLine width="1/2" className="h-3" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-hairline pt-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-[10px]" />
          ))}
        </div>
      </SkeletonCard>

      <SkeletonCard className="p-5">
        <Skeleton className="h-full min-h-24 w-full rounded-md bg-hairline" />
      </SkeletonCard>

      <div className="grid gap-3.5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3.5">
          <SkeletonCard className="p-5"><Skeleton className="h-28 w-full rounded-md" /></SkeletonCard>
          <SkeletonCard className="p-5"><Skeleton className="h-32 w-full rounded-md" /></SkeletonCard>
          <SkeletonCard className="p-5"><Skeleton className="h-40 w-full rounded-md" /></SkeletonCard>
        </div>
        <div className="space-y-3.5">
          <SkeletonCard className="p-5"><Skeleton className="h-28 w-full rounded-md" /></SkeletonCard>
          <SkeletonCard className="p-5"><Skeleton className="h-24 w-full rounded-md" /></SkeletonCard>
          <SkeletonCard className="p-5"><Skeleton className="h-36 w-full rounded-md" /></SkeletonCard>
        </div>
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
