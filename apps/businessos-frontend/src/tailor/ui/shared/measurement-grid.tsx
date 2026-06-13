import { cn } from "@/core/presentation/lib/utils";

interface MeasurementGridProps {
  items: Array<{ label: string; value: string | number }>;
  columns?: 2 | 3;
  isRtl?: boolean;
  className?: string;
}

export function MeasurementGrid({
  items,
  columns = 3,
  isRtl,
  className,
}: MeasurementGridProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 2 && "grid-cols-2",
        isRtl && "text-right",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[10px] bg-background px-2.5 py-2.5 text-center"
        >
          <p className="font-display text-base font-bold text-foreground">
            {item.value}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-slate">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
