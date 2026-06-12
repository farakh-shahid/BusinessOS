import { AdminGate } from "@/core/auth/admin-gate";
import { AnalyticsView } from "@/tailor/ui/analytics/analytics-view";

export default function AnalyticsPage() {
  return (
    <AdminGate>
      <AnalyticsView />
    </AdminGate>
  );
}
