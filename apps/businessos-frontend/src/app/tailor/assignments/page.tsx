import { AdminGate } from "@/core/auth/admin-gate";
import { AssignmentsView } from "@/tailor/ui/assignments/assignments-view";

export default function AssignmentsPage() {
  return (
    <AdminGate>
      <AssignmentsView />
    </AdminGate>
  );
}
