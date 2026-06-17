import { Skeleton } from "@/core/presentation/components/ui/skeleton";
import { cn } from "@/core/presentation/lib/utils";
import type { AssignmentView } from "@/tailor/infrastructure/data/assignment-board-utils";
import { SkeletonCircle, SkeletonLine } from "./skeleton-primitives";

function AssignmentPersonGridCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col rounded-[13px] border border-hairline bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonCircle size="md" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-28 max-w-full rounded-md" />
            <SkeletonLine width="1/2" className="h-3" />
          </div>
        </div>
        <Skeleton className="h-6 w-8 shrink-0 rounded-full" />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-5 w-16 rounded-full" />
        ))}
      </div>
      <div className="mt-4 border-t border-hairline pt-3">
        <Skeleton className="h-3 w-32 rounded-md" />
      </div>
    </div>
  );
}

function AssignmentsGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      aria-busy
      aria-label="Loading assignments"
    >
      {Array.from({ length: 6 }, (_, i) => (
        <AssignmentPersonGridCardSkeleton key={i} />
      ))}
    </div>
  );
}

function AssignmentColumnSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[min(560px,calc(100vh-16rem))] shrink-0 flex-col rounded-[13px] border border-hairline bg-card p-[11px]",
        className ?? "w-[max(220px,calc((100%-1.5rem)/3))]",
      )}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2 border-b border-hairline pb-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <SkeletonCircle size="sm" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <SkeletonLine width="1/2" className="h-3" />
          </div>
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

function AssignmentsBoardSkeleton() {
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

function AssignmentTableRowSkeleton() {
  return (
    <tr className="border-b border-hairline">
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-24 rounded-md" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-28 rounded-md" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-20 rounded-md" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-32 rounded-md" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-20 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-16 rounded-md" />
      </td>
    </tr>
  );
}

function AssignmentsTableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-[15px] border border-hairline bg-card shadow-sm"
      aria-busy
      aria-label="Loading assignments"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-slate-50/80">
              {Array.from({ length: 6 }, (_, i) => (
                <th key={i} className="px-4 py-2.5">
                  <Skeleton className="h-3 w-16 rounded-md" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, i) => (
              <AssignmentTableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AssignmentViewSwitcherSkeleton({
  isRtl,
}: {
  isRtl?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex justify-end",
        isRtl && "justify-start",
      )}
    >
      <Skeleton className="h-[34px] w-[108px] rounded-[10px] sm:w-64" />
    </div>
  );
}

export function AssignmentsSkeleton({
  view = "grid",
}: {
  view?: AssignmentView;
}) {
  if (view === "board") {
    return <AssignmentsBoardSkeleton />;
  }

  if (view === "table") {
    return <AssignmentsTableSkeleton />;
  }

  return <AssignmentsGridSkeleton />;
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
