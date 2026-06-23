import type { DashboardData } from "@business-os/shared";

export interface OrderRepositoryPort {
  getDashboard(): Promise<DashboardData>;
}

export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");
