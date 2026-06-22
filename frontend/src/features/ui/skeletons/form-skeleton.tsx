import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { SkeletonCard, SkeletonLine } from "./skeleton-primitives";

function FormSectionSkeleton({ fields = 2 }: { fields?: number }) {
  return (
    <SkeletonCard className="space-y-4">
      <Skeleton className="h-5 w-32 rounded-md" />
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonLine width="1/4" className="h-3" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}
    </SkeletonCard>
  );
}

export function NewOrderFormSkeleton() {
  return (
    <div className="space-y-6" aria-busy aria-label="Loading new order form">
      <div className="space-y-2">
        <SkeletonLine width="1/4" className="h-3" />
        <Skeleton className="h-7 w-40 rounded-lg" />
        <SkeletonLine width="1/2" className="h-3" />
      </div>
      <FormSectionSkeleton fields={2} />
      <FormSectionSkeleton fields={1} />
      <FormSectionSkeleton fields={4} />
      <FormSectionSkeleton fields={3} />
      <FormSectionSkeleton fields={5} />
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Skeleton className="h-11 w-full rounded-xl sm:w-28" />
        <Skeleton className="h-11 w-full rounded-xl sm:w-32" />
      </div>
    </div>
  );
}
