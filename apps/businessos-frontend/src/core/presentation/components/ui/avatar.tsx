import { cn } from "@/core/presentation/lib/utils";
import type { OrderStatus } from "@business-os/tailor";

const avatarBg: Record<OrderStatus, string> = {
  stitching: "bg-brand-50 text-brand-700",
  due_today: "bg-amber-50 text-amber-700",
  overdue: "bg-rose-50 text-rose-700",
  ready: "bg-emerald-50 text-emerald-700",
  cutting: "bg-sky-50 text-sky-700",
  pending: "bg-slate-100 text-slate-600",
  delivered: "bg-indigo-50 text-indigo-700",
  cancelled: "bg-rose-50 text-rose-700",
};

interface AvatarProps {
  initials: string;
  status: OrderStatus;
  className?: string;
}

export function Avatar({ initials, status, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
        avatarBg[status],
        className,
      )}
    >
      {initials}
    </div>
  );
}
