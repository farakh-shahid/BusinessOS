import { ShopHeroSkeleton } from "./shop-hero-skeleton";
import { CustomerSearchPanelSkeleton } from "./customer-search-skeleton";
import { OrderListSkeleton } from "./order-card-skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy aria-label="Loading dashboard">
      <ShopHeroSkeleton variant="dashboard" />
      <div className="grid gap-x-4 gap-y-3 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="hidden h-6 rounded-md bg-hairline xl:block" />
        <div className="hidden h-6 rounded-md bg-hairline xl:block" />
        <OrderListSkeleton count={3} showViewAll />
        <div className="hidden space-y-4 xl:block">
          <CustomerSearchPanelSkeleton />
        </div>
      </div>
      <div className="space-y-4 xl:hidden">
        <CustomerSearchPanelSkeleton />
      </div>
    </div>
  );
}
