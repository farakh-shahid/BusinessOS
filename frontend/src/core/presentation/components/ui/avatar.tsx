import { cn } from "@/core/presentation/lib/utils";
import type { OrderStatus } from "@shared";
import { statusAvatarClass } from "@/features/infrastructure/data/order-status-colors";

interface AvatarProps {
  initials: string;
  status: OrderStatus;
  className?: string;
}

export function Avatar({ initials, status, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
        statusAvatarClass(status),
        className,
      )}
    >
      {initials}
    </div>
  );
}
