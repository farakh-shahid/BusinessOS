import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { SkeletonCircle, SkeletonLine } from "./skeleton-primitives";

function CustomerListItemSkeleton() {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <SkeletonCircle size="md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-36 max-w-full rounded-md" />
        <SkeletonLine width="1/2" className="h-3" />
      </div>
      <Skeleton className="h-5 w-5 shrink-0 rounded-md" />
    </div>
  );
}

export function CustomerListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <section className="space-y-3">
      <Skeleton className="h-3 w-28 rounded-md" />
      {Array.from({ length: count }, (_, i) => (
        <CustomerListItemSkeleton key={i} />
      ))}
    </section>
  );
}
