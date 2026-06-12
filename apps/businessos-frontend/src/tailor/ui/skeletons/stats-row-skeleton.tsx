import { Skeleton } from "@/core/presentation/components/ui/skeleton";

function StatCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100/80 bg-white px-4 py-4 shadow-sm md:flex-row md:gap-4 md:px-5 md:py-5">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex w-full flex-col items-center gap-2 md:items-start">
        <Skeleton className="h-8 w-12 rounded-lg" />
        <Skeleton className="h-3 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:gap-6">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
}
