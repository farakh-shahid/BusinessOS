import { cn } from "@/core/presentation/lib/utils";
import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { SkeletonCircle, SkeletonLine } from "./skeleton-primitives";

export function OrderCardSkeleton() {
  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <SkeletonCircle size="md" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-32 max-w-full rounded-md" />
            <SkeletonLine width="1/4" className="h-2.5" />
            <SkeletonLine width="1/2" className="h-3" />
            <SkeletonLine width="3/4" className="h-3" />
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-3 md:border-0 md:pt-0">
          <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 md:flex md:flex-col md:gap-2">
            <Skeleton className="h-9 w-full rounded-xl md:w-[10.5rem]" />
            <Skeleton className="h-9 w-full rounded-xl md:w-[10rem]" />
          </div>
          <div className="flex items-stretch gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonLine width="full" className="h-2.5" />
              <SkeletonLine width="3/4" className="h-2.5" />
            </div>
            <Skeleton className="h-[4.75rem] w-[4.75rem] shrink-0 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderListSkeleton({
  count = 3,
  showViewAll = false,
  className,
}: {
  count?: number;
  showViewAll?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
      {showViewAll ? (
        <Skeleton className="mb-16 h-12 w-full rounded-2xl md:mb-0" />
      ) : null}
    </section>
  );
}
