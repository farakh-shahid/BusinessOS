export declare const DEFAULT_PAGE_SIZE = 100;
export declare const DASHBOARD_QUEUE_LIMIT = 10;
export interface PaginatedList<T> {
    items: T[];
    hasMore: boolean;
    nextOffset: number | null;
}
