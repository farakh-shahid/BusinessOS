import { ShopHeroSkeleton } from "./shop-hero-skeleton";
import { CustomerSearchPanelSkeleton } from "./customer-search-skeleton";
import { OrderListSkeleton } from "./order-card-skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy aria-label="Loading dashboard">
      <ShopHeroSkeleton showAction />
      <div className="xl:hidden space-y-3">
        <CustomerSearchPanelSkeleton />
      </div>

      <div className="h-3 w-32 rounded-md bg-hairline" />

      <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-2xl border border-hairline bg-card p-4">
          <div className="mb-4 h-5 w-40 rounded-md bg-hairline" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-[30px] w-[30px] rounded-[9px] bg-hairline" />
                <div className="h-5 w-5 rounded-md bg-hairline" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-24 rounded-md bg-hairline" />
                  <div className="h-3 w-40 rounded-md bg-hairline" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3.5">
          <div className="rounded-2xl border border-hairline bg-card p-4">
            <div className="mb-4 h-5 w-28 rounded-md bg-hairline" />
            <div className="flex h-14 gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 rounded-lg bg-hairline" />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-hairline bg-card p-4">
            <div className="mb-3 h-5 w-32 rounded-md bg-hairline" />
            <div className="h-8 w-36 rounded-md bg-hairline" />
            <div className="mt-4 flex h-[38px] items-end gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-hairline"
                  style={{ height: `${20 + i * 6}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-3 w-24 rounded-md bg-hairline" />

      <div className="grid gap-3.5 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-hairline bg-card p-4">
            <div className="mb-4 h-5 w-32 rounded-md bg-hairline" />
            <div className="h-28 rounded-md bg-hairline" />
          </div>
        ))}
      </div>

      <div className="h-3 w-28 rounded-md bg-hairline" />

      <div className="grid gap-3.5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <OrderListSkeleton count={3} showViewAll />
        <div className="hidden space-y-3.5 xl:block">
          <CustomerSearchPanelSkeleton />
        </div>
      </div>
    </div>
  );
}
