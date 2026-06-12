import { cn } from "@/core/presentation/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-100",
        className,
      )}
      {...props}
    />
  );
}
