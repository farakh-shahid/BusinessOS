import { ShopHeroSkeleton } from "./shop-hero-skeleton";
import { StatsRowSkeleton } from "./stats-row-skeleton";
import { CustomerSearchPanelSkeleton } from "./customer-search-skeleton";
import { OrderListSkeleton } from "./order-card-skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy aria-label="Loading dashboard">
      <ShopHeroSkeleton />
      <StatsRowSkeleton />
      <CustomerSearchPanelSkeleton />
      <OrderListSkeleton count={3} showViewAll />
    </div>
  );
}
