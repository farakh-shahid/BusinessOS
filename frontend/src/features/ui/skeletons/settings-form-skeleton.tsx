import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { SkeletonCard, SkeletonLine } from "./skeleton-primitives";

export function SettingsFormSkeleton() {
  return (
    <SkeletonCard className="space-y-4">
      <Skeleton className="h-5 w-36 rounded-md" />
      <div className="space-y-2">
        <SkeletonLine width="1/4" className="h-3" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <SkeletonLine width="1/3" className="h-3" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <SkeletonLine width="1/3" className="h-3" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonLine width="1/4" className="h-3" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <SkeletonLine width="1/3" className="h-3" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </SkeletonCard>
  );
}
