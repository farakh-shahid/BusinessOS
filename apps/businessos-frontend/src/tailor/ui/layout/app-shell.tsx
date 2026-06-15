"use client";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
  SidebarProvider,
  useSidebar,
} from "./sidebar-context";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShellContent({ children }: AppShellProps) {
  const { locale } = useLocale();
  const isRtl = locale === "ur";
  const { collapsed } = useSidebar();
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen w-full max-w-[100vw] bg-background">
      <AppSidebar />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200 ease-in-out",
          isRtl
            ? "md:pr-[var(--app-sidebar-width)]"
            : "md:pl-[var(--app-sidebar-width)]",
        )}
        style={
          {
            "--app-sidebar-width": sidebarWidth,
          } as React.CSSProperties
        }
      >
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 md:pb-8 md:pt-8 lg:px-10">
          <AppHeader />
          <main className="mt-5 min-w-0 space-y-6 md:mt-8 md:space-y-8">
            {children}
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}
