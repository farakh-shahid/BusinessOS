import { Skeleton } from "@/core/presentation/components/ui/skeleton";

export function CustomerDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <Skeleton className="h-4 w-36" />
      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex gap-4">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}
