import { CustomerEditView } from "@/tailor/ui/customers/customer-edit-view";

interface CustomerEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerEditPage({ params }: CustomerEditPageProps) {
  const { id } = await params;
  return <CustomerEditView customerId={id} />;
}
