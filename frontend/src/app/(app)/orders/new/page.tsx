import { Suspense } from "react";
import { NewOrderForm } from "@/features/ui/orders/new-order-form";

export default function TailorNewOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
          Loading...
        </div>
      }
    >
      <NewOrderForm />
    </Suspense>
  );
}
