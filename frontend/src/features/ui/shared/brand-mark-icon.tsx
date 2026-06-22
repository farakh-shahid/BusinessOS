import { cn } from "@/core/presentation/lib/utils";

interface BrandMarkIconProps {
  className?: string;
}

/** Isometric cube — orange top, white sides (BusinessOS brand mark) */
export function BrandMarkIcon({ className }: BrandMarkIconProps) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] border border-white/20 bg-white/10 shadow-inner ring-1 ring-white/10 backdrop-blur-sm",
        className,
      )}
      aria-hidden
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 5L26.5 11.5L16 18L5.5 11.5L16 5Z" fill="#FF6A2B" />
        <path
          d="M5.5 11.5L16 18V27L5.5 20.5V11.5Z"
          fill="white"
          fillOpacity="0.96"
        />
        <path d="M16 18L26.5 11.5V20.5L16 27V18Z" fill="#D8DEE8" />
        <path
          d="M16 5L26.5 11.5L16 18L5.5 11.5L16 5Z"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
