import type {
  CustomerListQuickFilterCounts,
  CustomerListQuickFilterKey,
} from "@shared";
import type { CustomerListSegment } from "./customer-list-filters";

export function customerQuickFilterCount(
  counts: CustomerListQuickFilterCounts,
  segment: CustomerListSegment,
): number {
  if (segment === "") return counts.all;
  if (segment in counts) {
    return counts[segment as Exclude<CustomerListQuickFilterKey, "all">];
  }
  return 0;
}
