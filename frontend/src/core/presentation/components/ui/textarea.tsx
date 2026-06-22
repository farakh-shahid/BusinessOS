import { cn } from "@/core/presentation/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[88px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand-100",
        className,
      )}
      {...props}
    />
  );
}
