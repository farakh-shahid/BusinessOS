import { AdminGate } from "@/core/auth/admin-gate";
import { ReceivablesView } from "@/tailor/ui/receivables/receivables-view";

export default function ReceivablesPage() {
  return (
    <AdminGate>
      <ReceivablesView />
    </AdminGate>
  );
}
