import { OrderDetailView } from "@/tailor/ui/orders/order-detail-view";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  return <OrderDetailView orderId={id} />;
}
