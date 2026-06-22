import { cn } from "@/core/presentation/lib/utils";

type ButtonVariant = "primary" | "brand" | "outline" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-500 text-white hover:bg-accent-600 shadow-sm shadow-accent-500/20 disabled:opacity-50",
  brand:
    "bg-brand-700 text-white hover:bg-brand-800 shadow-sm disabled:opacity-50",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50",
  ghost: "text-slate-600 hover:bg-slate-100 disabled:opacity-50",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
