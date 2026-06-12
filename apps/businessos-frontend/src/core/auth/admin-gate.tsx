"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDictionary } from "@business-os/i18n";
import { isAdminRole } from "@/core/auth/roles";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";

interface AdminGateProps {
  children: React.ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const { data: user, isLoading } = useMeQuery();

  useEffect(() => {
    if (!isLoading && user && !isAdminRole(user.role)) {
      router.replace(routes.dashboard);
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-slate-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!isAdminRole(user.role)) {
    return null;
  }

  return <>{children}</>;
}
