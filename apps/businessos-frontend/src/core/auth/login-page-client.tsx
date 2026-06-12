"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/core/auth/auth-storage";
import { routes } from "@/core/config/routes";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { LoginForm } from "@/core/auth/login-form";
import { Skeleton } from "@/core/presentation/components/ui/skeleton";

export function LoginPageClient() {
  const router = useRouter();
  const hasToken = typeof window !== "undefined" && !!getAccessToken();
  const { data: user, isLoading } = useMeQuery(hasToken);

  useEffect(() => {
    if (user) {
      router.replace(routes.dashboard);
    }
  }, [user, router]);

  if (hasToken && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-sm space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <Skeleton className="mx-auto h-12 w-12 rounded-2xl bg-white/20" />
          <Skeleton className="mx-auto h-4 w-32 rounded-md bg-white/20" />
          <Skeleton className="h-11 w-full rounded-xl bg-white/15" />
          <Skeleton className="h-11 w-full rounded-xl bg-white/15" />
          <Skeleton className="h-11 w-full rounded-xl bg-white/25" />
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <LoginForm />;
}
