"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/core/auth/auth-storage";
import { routes } from "@/core/config/routes";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { AppLoadingScreen } from "@/core/presentation/components/app-loading-screen";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
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
    return <AppLoadingScreen />;
  }

  return <>{children}</>;
}
