import { AdminGate } from "@/core/auth/admin-gate";
import { AssignmentsView } from "@/features/ui/assignments/assignments-view";

export default function AssignmentsPage() {
  return (
    <AdminGate>
      <AssignmentsView />
    </AdminGate>
  );
}
