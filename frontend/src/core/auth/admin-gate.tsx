"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminRole } from "@/core/auth/roles";
import { routes } from "@/core/config/routes";
import { useMeQuery } from "@/features/infrastructure/api/hooks/use-auth";
import { AppLoadingScreen } from "@/core/presentation/components/app-loading-screen";

interface AdminGateProps {
  children: React.ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const router = useRouter();
  const { data: user, isLoading } = useMeQuery();

  useEffect(() => {
    if (!isLoading && user && !isAdminRole(user.role)) {
      router.replace(routes.dashboard);
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <AppLoadingScreen />;
  }

  if (!isAdminRole(user.role)) {
    return null;
  }

  return <>{children}</>;
}
