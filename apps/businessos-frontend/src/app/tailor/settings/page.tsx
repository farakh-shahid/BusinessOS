import { AdminGate } from "@/core/auth/admin-gate";
import { SettingsView } from "@/tailor/ui/settings/settings-view";

export default function SettingsPage() {
  return (
    <AdminGate>
      <SettingsView />
    </AdminGate>
  );
}
