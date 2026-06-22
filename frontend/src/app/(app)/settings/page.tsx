import { AdminGate } from "@/core/auth/admin-gate";
import { SettingsView } from "@/features/ui/settings/settings-view";

export default function SettingsPage() {
  return (
    <AdminGate>
      <SettingsView />
    </AdminGate>
  );
}
