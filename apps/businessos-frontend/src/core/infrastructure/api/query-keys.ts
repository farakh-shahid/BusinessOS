export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  customers: {
    all: ["customers"] as const,
    infiniteList: (params?: { q?: string; segment?: string }) =>
      ["customers", "infinite", params ?? {}] as const,
    detail: (id: string) => ["customers", id] as const,
    search: (q: string) => ["customers", "search", q] as const,
    lookup: (q: string) => ["customers", "lookup", q] as const,
    byPhone: (phone: string) => ["customers", "by-phone", phone] as const,
  },
  orders: {
    dashboard: ["orders", "dashboard"] as const,
    all: ["orders"] as const,
    list: (params?: {
      filter?: string;
      customerId?: string;
      search?: string;
      assignedTo?: string;
      sort?: string;
      dueFrom?: string;
      dueTo?: string;
    }) => ["orders", "list", params ?? {}] as const,
    infiniteList: (params?: {
      filter?: string;
      customerId?: string;
      search?: string;
      assignedTo?: string;
      sort?: string;
      dueFrom?: string;
      dueTo?: string;
    }) => ["orders", "infinite", params ?? {}] as const,
    filterCounts: (params?: {
      customerId?: string;
      search?: string;
      assignedTo?: string;
      dueFrom?: string;
      dueTo?: string;
    }) => ["orders", "filter-counts", params ?? {}] as const,
    receivables: ["orders", "receivables"] as const,
    assignments: ["orders", "assignments"] as const,
    detail: (id: string) => ["orders", id] as const,
  },
  settings: {
    tenant: ["settings", "tenant"] as const,
  },
  staff: {
    all: ["staff"] as const,
  },
  analytics: {
    overview: (view: string, anchor: string, focus: string) =>
      ["analytics", "overview", view, anchor, focus] as const,
  },
  measurements: {
    byCustomer: (customerId: string) =>
      ["measurements", customerId] as const,
  },
};
