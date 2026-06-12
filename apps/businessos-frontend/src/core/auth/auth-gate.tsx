"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDictionary } from "@business-os/i18n";
import { getAccessToken } from "@/core/auth/auth-storage";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const { isLoading, isError } = useMeQuery(ready && hasToken);

  useEffect(() => {
    setHasToken(!!getAccessToken());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !hasToken) {
      router.replace(routes.login);
    }
  }, [ready, hasToken, router]);

  useEffect(() => {
    if (isError) {
      router.replace(routes.login);
    }
  }, [isError, router]);

  if (!ready || !hasToken || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-500 shadow-sm">
          {t.common.loading}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
