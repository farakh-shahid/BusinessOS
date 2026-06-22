export interface PeriodMetrics {
  orders: number;
  revenue: number;
  advanceCollected: number;
}

export interface AnalyticsStatusBreakdown {
  pending: number;
  inProgress: number;
  ready: number;
  delivered: number;
  cancelled: number;
}

export interface GarmentAnalyticsItem {
  garmentType: string;
  garmentLabel: string;
  count: number;
  revenue: number;
}

export interface DailyAnalyticsPoint {
  date: string;
  dayLabel: string;
  dateLabel: string;
  orders: number;
  revenue: number;
  disabled?: boolean;
}

export interface MonthlyTrendPoint {
  month: string;
  monthLabel: string;
  orders: number;
  revenue: number;
}

export interface WorkflowSnapshot {
  inProgress: number;
  delivered: number;
}

export interface ReceivablesAgingBucket {
  key: "current" | "late_1_2w" | "late_2w_plus";
  amount: number;
}

export interface DebtorRow {
  customerId: string;
  customerName: string;
  balance: number;
  daysLate: number;
}

export interface KarigarOutputRow {
  name: string;
  pieces: number;
  revenue: number;
}

export interface TopCustomerRow {
  customerId: string;
  customerName: string;
  revenue: number;
  orderCount: number;
}

export interface BusiestDayRow {
  dayKey: number;
  dayLabel: string;
  orders: number;
}

export interface TailorAnalytics {
  shopName: string;
  tenantCreatedAt: string;
  generatedAt: string;
  viewMode: "week" | "month";
  rangeStart: string;
  rangeEnd: string;
  rangeLabel: string;
  /** When set, cards and pipeline reflect this day (week view) or week (month view). */
  focusDate?: string;
  focusLabel?: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  selectedPeriod: PeriodMetrics;
  previousPeriod: PeriodMetrics;
  periodComparison: {
    ordersChangePercent: number | null;
    revenueChangePercent: number | null;
  };
  outstandingBalance: number;
  totalCustomers: number;
  statusBreakdown: AnalyticsStatusBreakdown;
  topGarments: GarmentAnalyticsItem[];
  /** All garment types in the selected period, sorted by revenue */
  garmentBreakdown: GarmentAnalyticsItem[];
  dailyBreakdown: DailyAnalyticsPoint[];
  /** Last 6 calendar months (orders created in each month) */
  monthlyTrend: MonthlyTrendPoint[];
  workflowSnapshot: WorkflowSnapshot;
  comparisonPeriodLabel: string;
  currentPeriodLabel: string;
  avgOrderValue: number;
  completionRate: number;
  /** Calendar month containing anchor (shop-wide snapshot) */
  currentMonth: PeriodMetrics;
  currentMonthComparison: {
    revenueChangePercent: number | null;
  };
  /** Last 12 calendar months of booked revenue */
  yearlyTrend: MonthlyTrendPoint[];
  receivablesAging: ReceivablesAgingBucket[];
  receivablesCustomersOwing: number;
  topDebtors: DebtorRow[];
  productionPipeline: {
    orderCount: number;
    totalValue: number;
  };
  busiestDays: BusiestDayRow[];
  karigarOutput: KarigarOutputRow[];
  topCustomers: TopCustomerRow[];
  advanceCollectionRate: number;
}
