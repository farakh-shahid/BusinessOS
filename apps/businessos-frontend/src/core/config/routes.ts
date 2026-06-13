export const routes = {
  login: "/login",
  signup: "/signup",
  dashboard: "/tailor/dashboard",
  orders: "/tailor/orders",
  ordersWithFilter: (filter: string) =>
    filter ? `/tailor/orders?filter=${encodeURIComponent(filter)}` : "/tailor/orders",
  ordersWithAssignedTo: (name: string) =>
    `/tailor/orders?assignedTo=${encodeURIComponent(name)}`,
  assignments: "/tailor/assignments",
  orderDetail: (id: string) => `/tailor/orders/${id}`,
  receivables: "/tailor/receivables",
  customers: "/tailor/customers",
  customerDetail: (id: string) => `/tailor/customers/${id}`,
  customerEdit: (id: string) => `/tailor/customers/${id}/edit`,
  analytics: "/tailor/analytics",
  settings: "/tailor/settings",
  staff: "/tailor/staff",
  newOrder: "/tailor/orders/new",
  newOrderForCustomer: (customerId: string) =>
    `/tailor/orders/new?customerId=${customerId}`,
} as const;
