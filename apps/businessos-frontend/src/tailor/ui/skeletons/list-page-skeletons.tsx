import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { SkeletonCard, SkeletonCircle, SkeletonLine } from "./skeleton-primitives";

function AssignmentCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonCircle size="md" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <SkeletonLine width="3/4" className="h-3" />
          </div>
        </div>
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </SkeletonCard>
  );
}

export function AssignmentsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-busy aria-label="Loading assignments">
      <AssignmentCardSkeleton />
      <AssignmentCardSkeleton />
    </div>
  );
}

function ReceivableRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <SkeletonLine width="1/4" className="h-2.5" />
        <SkeletonLine width="1/2" className="h-3" />
      </div>
      <div className="space-y-2 text-right">
        <Skeleton className="ml-auto h-6 w-20 rounded-md" />
        <SkeletonLine width="1/3" className="ml-auto h-2.5" />
      </div>
    </div>
  );
}

export function ReceivablesListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul className="space-y-3" aria-busy aria-label="Loading receivables">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <ReceivableRowSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function ReceivablesSummarySkeleton() {
  return <Skeleton className="mb-4 h-28 w-full rounded-2xl" />;
}

function StaffRowSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-36 rounded-md" />
        <SkeletonLine width="1/2" className="h-3" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl sm:w-44" />
    </div>
  );
}

export function StaffListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul className="space-y-3" aria-busy aria-label="Loading staff">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <StaffRowSkeleton />
        </li>
      ))}
    </ul>
  );
}
