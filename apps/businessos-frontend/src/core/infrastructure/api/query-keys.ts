export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  customers: {
    all: ["customers"] as const,
    detail: (id: string) => ["customers", id] as const,
    search: (q: string) => ["customers", "search", q] as const,
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
