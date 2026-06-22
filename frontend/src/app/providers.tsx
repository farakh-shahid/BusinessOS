"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LocaleProvider } from "@/core/i18n/locale-context";
import { ToastProvider } from "@/core/presentation/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <ToastProvider>{children}</ToastProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
