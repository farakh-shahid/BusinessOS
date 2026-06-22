import { AdminGate } from "@/core/auth/admin-gate";
import { CustomersView } from "@/features/ui/customers/customers-view";

export default function CustomersPage() {
  return (
    <AdminGate>
      <CustomersView />
    </AdminGate>
  );
}
