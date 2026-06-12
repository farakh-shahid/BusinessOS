import { AuthGate } from "@/core/auth/auth-gate";
import { MobileShell } from "@/tailor/ui/layout/mobile-shell";

export default function TailorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <MobileShell>{children}</MobileShell>
    </AuthGate>
  );
}
