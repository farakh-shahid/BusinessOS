import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { SkeletonCard, SkeletonCircle, SkeletonLine } from "./skeleton-primitives";

export function CustomerSearchPanelSkeleton() {
  return (
    <section className="rounded-2xl border border-hairline bg-card px-4 py-[18px] shadow-sm sm:px-5">
      <Skeleton className="mb-3 h-4 w-28 rounded-md" />
      <Skeleton className="h-11 w-full rounded-[11px]" />
    </section>
  );
}

export function CustomerSearchResultsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="mt-4 space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
        >
          <div className="flex gap-3">
            <SkeletonCircle size="md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-32 max-w-full rounded-md" />
              <SkeletonLine width="1/2" className="h-3" />
              <SkeletonLine width="1/3" className="h-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
