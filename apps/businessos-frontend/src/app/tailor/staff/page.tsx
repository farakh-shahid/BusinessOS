import { AdminGate } from "@/core/auth/admin-gate";
import { StaffView } from "@/tailor/ui/staff/staff-view";

export default function StaffPage() {
  return (
    <AdminGate>
      <StaffView />
    </AdminGate>
  );
}
