"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Eye,
  EyeOff,
  Languages,
  Ruler,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { ApiError } from "@/core/infrastructure/api/api-client";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { useLoginMutation } from "@/tailor/infrastructure/api/hooks/use-auth";
import { LanguageToggle } from "@/tailor/ui/layout/language-toggle";

const loginFeatures = [
  { icon: CalendarClock, titleKey: "featureOrdersTitle", descKey: "featureOrdersDesc" },
  { icon: Ruler, titleKey: "featureMeasurementsTitle", descKey: "featureMeasurementsDesc" },
  { icon: Users, titleKey: "featureCustomersTitle", descKey: "featureCustomersDesc" },
  { icon: Languages, titleKey: "featureBilingualTitle", descKey: "featureBilingualDesc" },
] as const;

export function LoginForm() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const login = useLoginMutation();
  const [loginId, setLoginId] = useState("admin@demotailor.pk");
  const [password, setPassword] = useState("changeme123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      await login.mutateAsync({ login: loginId.trim(), password });
      router.replace(routes.dashboard);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError(t.auth.invalidCredentials);
      } else {
        setError(t.common.error);
      }
    }
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-2"
    >
      <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-sidebar-dark" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-accent-400/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sidebar-light/30 blur-3xl" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

        <div className="relative z-10 p-10 xl:p-14">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
            <Scissors className="h-5 w-5 text-amber-300" />
            <span className="text-sm font-semibold tracking-wide">{t.appName}</span>
          </div>
          <h1 className="mt-10 max-w-lg text-4xl font-bold leading-tight text-white xl:text-5xl">
            {t.auth.shopLabel}
          </h1>
          <p className="mt-4 max-w-md text-lg text-sidebar-text">{t.auth.shopBlurb}</p>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-10 xl:px-14">
          <ul className="grid max-w-lg gap-3">
            {loginFeatures.map(({ icon: Icon, titleKey, descKey }) => (
              <li
                key={titleKey}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm",
                  isRtl && "flex-row-reverse text-right",
                )}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white">
                    {t.auth[titleKey]}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-sidebar-text">
                    {t.auth[descKey]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 p-10 xl:p-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-sidebar-text backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>{t.appTagline}</span>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="inline-flex items-center gap-2 rounded-xl bg-sidebar px-3 py-2 text-white">
              <Scissors className="h-4 w-4" />
              <span className="text-sm font-semibold">{t.appName}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
            <div className={cn("flex items-start justify-between gap-4", isRtl && "flex-row-reverse")}>
              <div className={cn(isRtl && "text-right")}>
                <h2 className="text-2xl font-bold text-slate-900">{t.auth.welcomeBack}</h2>
                <p className="mt-2 text-sm text-slate-500">{t.auth.signInSubtitle}</p>
              </div>
              <LanguageToggle />
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="login">{t.auth.loginId}</Label>
                <Input
                  id="login"
                  type="text"
                  autoComplete="username"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="mt-1.5"
                  placeholder={t.auth.loginIdPlaceholder}
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">{t.auth.password}</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(isRtl ? "pl-11" : "pr-11")}
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={cn(
                      "absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700",
                      isRtl ? "left-1" : "right-1",
                    )}
                    aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="min-h-11 w-full text-base"
                disabled={login.isPending}
              >
                {login.isPending ? t.auth.signingIn : t.auth.signIn}
              </Button>
            </form>

            <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
              {t.auth.demoHint}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
