/** Default max rows per list page (orders, customers, etc.). */
export const DEFAULT_PAGE_SIZE = 100;

/** Max in-progress orders returned on the dashboard queue preview. */
export const DASHBOARD_QUEUE_LIMIT = 10;

export interface PaginatedList<T> {
  items: T[];
  hasMore: boolean;
  nextOffset: number | null;
}
