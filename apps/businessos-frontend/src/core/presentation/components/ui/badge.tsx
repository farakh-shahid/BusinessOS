import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/core/presentation/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
  {
    variants: {
      variant: {
        stitching: "bg-brand-100 text-brand-800",
        due_today: "bg-amber-100 text-amber-700",
        overdue: "bg-rose-100 text-rose-700",
        ready: "bg-emerald-100 text-emerald-700",
        cutting: "bg-sky-100 text-sky-700",
        pending: "bg-slate-100 text-slate-600",
        delivered: "bg-indigo-100 text-indigo-700",
        cancelled: "bg-rose-100 text-rose-700",
      },
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
