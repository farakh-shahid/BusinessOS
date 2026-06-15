import { AdminGate } from "@/core/auth/admin-gate";
import { CustomerDetailView } from "@/tailor/ui/customers/customer-detail-view";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  return (
    <AdminGate>
      <CustomerDetailView customerId={id} />
    </AdminGate>
  );
}
