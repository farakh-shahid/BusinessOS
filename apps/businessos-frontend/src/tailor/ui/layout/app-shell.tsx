"use client";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { FabButton } from "./fab-button";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { locale } = useLocale();
  const isRtl = locale === "ur";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-slate-50/80">
      <AppSidebar />

      <div
        className={cn(
          "flex min-h-screen flex-col",
          isRtl ? "md:pr-[17.5rem]" : "md:pl-[17.5rem]",
        )}
      >
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-5 sm:px-6 md:pb-8 md:pt-8 lg:px-10">
          <AppHeader />
          <main className="mt-5 space-y-6 md:mt-8 md:space-y-8">{children}</main>
        </div>
      </div>

      <FabButton />
      <MobileNav />
    </div>
  );
}
