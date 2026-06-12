import { ChevronDown } from "lucide-react";
import { cn } from "@/core/presentation/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-900 outline-none transition-colors",
          "hover:border-slate-300 focus:border-brand-700 focus:ring-2 focus:ring-brand-100",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}
