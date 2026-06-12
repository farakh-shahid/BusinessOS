"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDictionary } from "@business-os/i18n";
import { getAccessToken } from "@/core/auth/auth-storage";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { LoginForm } from "@/core/auth/login-form";

export function LoginPageClient() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const hasToken = typeof window !== "undefined" && !!getAccessToken();
  const { data: user, isLoading } = useMeQuery(hasToken);

  useEffect(() => {
    if (user) {
      router.replace(routes.dashboard);
    }
  }, [user, router]);

  if (hasToken && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-200">
          {t.common.loading}
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <LoginForm />;
}
