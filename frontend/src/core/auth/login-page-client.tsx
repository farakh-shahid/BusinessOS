"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/core/auth/auth-storage";
import { routes } from "@/core/config/routes";
import { useMeQuery } from "@/features/infrastructure/api/hooks/use-auth";
import { LoginForm } from "@/core/auth/login-form";
import { Skeleton } from "@/core/presentation/components/ui/skeleton";

export function LoginPageClient() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getAccessToken());
  }, []);

  const { data: user, isLoading } = useMeQuery(hasToken);

  useEffect(() => {
    if (user) {
      router.replace(routes.dashboard);
    }
  }, [user, router]);

  if (hasToken && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-[380px] space-y-4 rounded-2xl border border-hairline bg-card p-6 shadow-sm">
          <Skeleton className="mx-auto h-12 w-12 rounded-[13px] bg-hairline" />
          <Skeleton className="mx-auto h-4 w-32 rounded-md bg-hairline" />
          <Skeleton className="h-11 w-full rounded-xl bg-hairline" />
          <Skeleton className="h-11 w-full rounded-xl bg-hairline" />
          <Skeleton className="h-12 w-full rounded-xl bg-accent-500/20" />
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <LoginForm />;
}
