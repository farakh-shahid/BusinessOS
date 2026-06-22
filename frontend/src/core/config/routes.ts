export const routes = {
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  orders: "/orders",
  ordersWithFilter: (filter: string) =>
    filter ? `/orders?filter=${encodeURIComponent(filter)}` : "/orders",
  ordersWithAssignedTo: (name: string) =>
    `/orders?assignedTo=${encodeURIComponent(name)}`,
  assignments: "/assignments",
  orderDetail: (id: string) => `/orders/${id}`,
  receivables: "/receivables",
  customers: "/customers",
  customerDetail: (id: string) => `/customers/${id}`,
  customerEdit: (id: string) => `/customers/${id}/edit`,
  analytics: "/analytics",
  settings: "/settings",
  staff: "/staff",
  newOrder: "/orders/new",
  newOrderForCustomer: (customerId: string) =>
    `/orders/new?customerId=${customerId}`,
} as const;
