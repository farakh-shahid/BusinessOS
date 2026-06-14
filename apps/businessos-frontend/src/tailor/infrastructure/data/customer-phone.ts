import { normalizePakistanPhone } from "@business-os/shared";
import type { TailorCustomer } from "@business-os/tailor";

export function findCustomerByPhone(
  customers: TailorCustomer[],
  phone: string,
): TailorCustomer | undefined {
  const normalized = normalizePakistanPhone(phone.trim());
  if (!normalized) return undefined;

  return customers.find((customer) => customer.phone === normalized);
}
