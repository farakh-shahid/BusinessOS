import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { SkeletonCard, SkeletonCircle, SkeletonLine } from "./skeleton-primitives";

export function CustomerSearchPanelSkeleton() {
  return (
    <SkeletonCard>
      <Skeleton className="h-5 w-36 rounded-md" />
      <SkeletonLine width="3/4" className="mt-2 h-3" />
      <div className="mt-4 flex h-11 overflow-hidden rounded-xl border border-hairline">
        <Skeleton className="h-full min-w-0 flex-1 rounded-none" />
        <Skeleton className="h-full w-11 shrink-0 rounded-none sm:w-28" />
      </div>
    </SkeletonCard>
  );
}

export function CustomerSearchResultsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="mt-6 space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
        >
          <div className="flex gap-3">
            <SkeletonCircle size="lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-40 max-w-full rounded-md" />
              <SkeletonLine width="1/2" className="h-3" />
              <SkeletonLine width="1/3" className="h-3" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
