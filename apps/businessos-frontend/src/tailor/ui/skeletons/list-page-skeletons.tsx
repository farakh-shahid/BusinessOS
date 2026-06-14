import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { cn } from "@/core/presentation/lib/utils";
import { SkeletonCircle, SkeletonLine } from "./skeleton-primitives";

function AssignmentColumnSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-[min(560px,calc(100vh-16rem))] shrink-0 rounded-[13px] border border-hairline bg-card p-[11px]",
        className ?? "w-[max(220px,calc((100%-1.5rem)/3))]",
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <SkeletonCircle size="sm" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
        <Skeleton className="h-5 w-6 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-[72px] w-full rounded-[10px]" />
        <Skeleton className="h-[72px] w-full rounded-[10px]" />
      </div>
    </div>
  );
}

export function AssignmentsSkeleton() {
  return (
    <div className="space-y-3" aria-busy aria-label="Loading assignments">
      <div className="flex gap-3 overflow-hidden pb-2">
        {Array.from({ length: 3 }, (_, i) => (
          <AssignmentColumnSkeleton key={`worker-${i}`} />
        ))}
      </div>
      <div className="flex gap-3 overflow-hidden pb-2">
        <AssignmentColumnSkeleton className="w-[max(220px,calc((100%-2.25rem)/4))]" />
      </div>
    </div>
  );
}

function ReceivableRowSkeleton() {
  return (
    <tr className="border-b border-hairline">
      <td className="px-4 py-3.5">
        <Skeleton className="h-4 w-32 rounded-md" />
      </td>
      <td className="px-4 py-3.5">
        <Skeleton className="h-4 w-24 rounded-md" />
      </td>
      <td className="px-4 py-3.5">
        <Skeleton className="h-4 w-8 rounded-md" />
      </td>
      <td className="px-4 py-3.5 text-right">
        <Skeleton className="ml-auto h-4 w-20 rounded-md" />
      </td>
      <td className="px-4 py-3.5">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

export function ReceivablesListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className="overflow-hidden rounded-[15px] border border-hairline bg-card shadow-sm"
      aria-busy
      aria-label="Loading receivables"
    >
      <div className="border-b border-hairline px-4 py-3.5 sm:px-5">
        <Skeleton className="h-5 w-36 rounded-md" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <tbody>
            {Array.from({ length: count }, (_, i) => (
              <ReceivableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ReceivablesSummarySkeleton() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
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
