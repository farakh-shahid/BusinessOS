import { cva, type VariantProps } from "class-variance-authority";
import type { OrderStatus } from "@shared";
import { cn } from "@/core/presentation/lib/utils";
import { statusColorClasses, displayStatusColorKey } from "@/features/infrastructure/data/order-status-colors";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm",
  {
    variants: {
      variant: Object.fromEntries(
        (Object.keys(displayStatusColorKey) as OrderStatus[]).map((status) => [
          status,
          statusColorClasses[displayStatusColorKey[status]].badge,
        ]),
      ) as Record<OrderStatus, string>,
    },
    defaultVariants: {
      variant: "pending",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
