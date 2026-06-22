import { normalizePakistanPhone } from "@shared";
import type { TailorCustomer } from "@shared";

export function findCustomerByPhone(
  customers: TailorCustomer[],
  phone: string,
): TailorCustomer | undefined {
  const normalized = normalizePakistanPhone(phone.trim());
  if (!normalized) return undefined;

  return customers.find((customer) => customer.phone === normalized);
}
