import { cn } from "@/core/presentation/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-slate-200/90", className)}
      aria-hidden
      {...props}
    />
  );
}
