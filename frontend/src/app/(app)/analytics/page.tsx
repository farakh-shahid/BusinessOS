import { AdminGate } from "@/core/auth/admin-gate";
import { AnalyticsView } from "@/features/ui/analytics/analytics-view";

export default function AnalyticsPage() {
  return (
    <AdminGate>
      <AnalyticsView />
    </AdminGate>
  );
}
