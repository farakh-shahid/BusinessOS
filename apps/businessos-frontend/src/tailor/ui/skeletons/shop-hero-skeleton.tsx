import { Skeleton } from "@/core/presentation/components/ui/skeleton";

export function ShopHeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 p-6 sm:p-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-32 bg-white/40" />
        <Skeleton className="h-8 w-56 max-w-full bg-white/50 sm:h-9" />
        <Skeleton className="h-3 w-24 bg-white/35" />
      </div>
    </div>
  );
}
