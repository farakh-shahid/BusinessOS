/** Default max rows per list page (orders, customers, etc.). */
export const DEFAULT_PAGE_SIZE = 100;

export interface PaginatedList<T> {
  items: T[];
  hasMore: boolean;
  nextOffset: number | null;
}
