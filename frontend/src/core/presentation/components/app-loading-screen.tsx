import { BrandMarkIcon } from "@/features/ui/shared/brand-mark-icon";

const brandPulseStyle = {
  animation: "brand-pulse 2.8s ease-in-out infinite",
} as const;

export function AppLoadingScreen() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-50 p-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <div
        className="flex items-center gap-3.5 will-change-[opacity,transform]"
        style={brandPulseStyle}
      >
        <div className="rounded-2xl bg-gradient-to-br from-[#0E1A36] to-[#1A2747] p-3 shadow-lg shadow-[#0E1A36]/15">
          <BrandMarkIcon className="h-12 w-12" />
        </div>
        <p className="font-display text-2xl font-bold leading-none tracking-tight">
          <span className="text-[#0E1A36]">Business</span>
          <span className="text-accent-500">OS</span>
        </p>
      </div>
    </div>
  );
}
