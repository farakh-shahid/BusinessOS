"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Scissors } from "lucide-react";
import { isValidPakistanPhone } from "@shared";
import { getDictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { sanitizeLoginIdentifierInput } from "@/core/presentation/lib/pakistan-phone-input";
import { FormFieldError } from "@/core/presentation/components/ui/form-field-error";
import { ApiError } from "@/core/infrastructure/api/api-client";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { useLoginMutation } from "@/features/infrastructure/api/hooks/use-auth";
import { LanguageToggle } from "@/features/ui/layout/language-toggle";

const loginFeatures = [
  "featureTrack",
  "featureWhatsApp",
  "featureAnalytics",
] as const;

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const login = useLoginMutation();
  const [loginId, setLoginId] = useState("admin@demotailor.pk");
  const [password, setPassword] = useState("changeme123");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginTouched, setLoginTouched] = useState(false);
  const [loginSubmitted, setLoginSubmitted] = useState(false);

  const isPhoneLogin =
    loginId.trim().length > 0 && !loginId.includes("@");
  const loginPhoneError =
    isPhoneLogin &&
    (loginTouched || loginSubmitted) &&
    !isValidPakistanPhone(loginId.trim())
      ? t.validation.phoneInvalid
      : undefined;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoginSubmitted(true);

    const loginValue = loginId.trim();
    if (loginValue && !loginValue.includes("@") && !isValidPakistanPhone(loginValue)) {
      return;
    }

    try {
      await login.mutateAsync({ login: loginValue, password });
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
      className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-[1.05fr_1fr]"
    >
      <section className="relative flex flex-col overflow-hidden bg-gradient-to-br from-[#0E1A36] to-[#1A2747] px-7 py-8 text-white sm:px-[52px] sm:py-[46px] lg:min-h-screen">
        <div
          className="pointer-events-none absolute -bottom-[90px] -right-[90px] h-[340px] w-[340px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, #FF6A2B 36%, transparent), transparent 70%)",
          }}
        />
        <div className="pointer-events-none absolute left-[52px] right-[52px] top-[130px] hidden h-px bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.25)_0_8px,transparent_8px_16px)] lg:block" />

        <div
          className={cn(
            "relative z-[1] flex items-center gap-[13px]",
            isRtl && "flex-row-reverse",
          )}
        >
          <span className="grid h-[46px] w-[46px] place-items-center rounded-[13px] bg-gradient-to-br from-accent-500 to-[color-mix(in_srgb,#FF6A2B_55%,#fff)]">
            <Scissors className="h-[23px] w-[23px] text-white" strokeWidth={2} />
          </span>
          <div className={cn(isRtl && "text-right")}>
            <b className="font-display block text-xl font-bold leading-[1.1]">
              {t.appName}
            </b>
            <small className="text-[11px] tracking-[0.02em] text-white/55">
              {t.auth.brandTagline}
            </small>
          </div>
        </div>

        <div className="relative z-[1] my-6 max-w-[420px] lg:my-auto">
          <h1 className="font-display text-[28px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[38px]">
            {t.auth.headlinePrefix}{" "}
            <span className="text-accent-500">{t.auth.headlineAccent}</span>
          </h1>
          <p className="mt-3.5 text-[15px] leading-relaxed text-white/66">
            {t.auth.headlineSub}
          </p>

          <div className="mt-[30px] hidden flex-col gap-[13px] lg:flex">
            {loginFeatures.map((key) => (
              <div
                key={key}
                className={cn(
                  "flex items-center gap-3 text-sm text-white/[0.86]",
                  isRtl && "flex-row-reverse text-right",
                )}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white/10 text-xs text-accent-500">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {t.auth[key]}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-[1] hidden text-xs text-white/40 lg:block">
          {t.auth.brandFooter}
        </p>
      </section>

      <section className="flex min-h-0 flex-col px-6 py-7 sm:px-10 sm:py-10 lg:min-h-screen lg:px-14 lg:py-10">
        <div className="ftop flex items-center justify-between gap-3.5">
          <LanguageToggle />
        </div>

        <div className="mx-auto my-auto w-full max-w-[380px] py-8 lg:py-0">
          <h2 className="font-display text-[26px] font-bold tracking-[-0.01em] text-foreground">
            {t.auth.welcomeBack}
          </h2>
          <button
            type="button"
            disabled
            className="mt-[26px] flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-hairline bg-card px-3 py-3 text-sm font-semibold text-foreground opacity-70"
            aria-disabled
            title={t.auth.continueWithGoogle}
          >
            <GoogleIcon />
            {t.auth.continueWithGoogle}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-slate">
            <span className="h-px flex-1 bg-hairline" />
            {t.auth.orSignInWithEmail}
            <span className="h-px flex-1 bg-hairline" />
          </div>

          <form onSubmit={handleSubmit}>
            {error ? (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="mb-[15px]">
              <label
                htmlFor="login"
                className="mb-1.5 block text-[12.5px] font-semibold text-foreground"
              >
                {t.auth.loginId}
              </label>
              <input
                id="login"
                type="text"
                autoComplete="username"
                value={loginId}
                onChange={(e) =>
                  setLoginId(sanitizeLoginIdentifierInput(e.target.value))
                }
                onBlur={() => setLoginTouched(true)}
                placeholder={t.auth.loginIdPlaceholder}
                dir="ltr"
                required
                aria-invalid={Boolean(loginPhoneError)}
                className={cn(
                  "w-full rounded-xl border bg-card px-3.5 py-[13px] text-sm text-foreground transition placeholder:text-muted-slate focus:outline-none focus:ring-[3px]",
                  loginPhoneError
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-hairline focus:border-accent-500 focus:ring-accent-50",
                )}
              />
              {!loginPhoneError ? (
                <p className="mt-1 text-xs text-muted-slate">{t.form.phoneHint}</p>
              ) : null}
              <FormFieldError message={loginPhoneError} />
            </div>

            <div className="mb-[15px]">
              <label
                htmlFor="password"
                className="mb-1.5 block text-[12.5px] font-semibold text-foreground"
              >
                {t.auth.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  required
                  className={cn(
                    "w-full rounded-xl border border-hairline bg-card py-[13px] text-sm text-foreground transition placeholder:text-muted-slate focus:border-accent-500 focus:outline-none focus:ring-[3px] focus:ring-accent-50",
                    isRtl ? "pl-11 pr-3.5" : "pr-11 pl-3.5",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 text-muted-slate transition hover:text-foreground",
                    isRtl ? "left-3" : "right-3",
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

            <div
              className={cn(
                "mb-[22px] flex items-center justify-between text-[13px]",
                isRtl && "flex-row-reverse",
              )}
            >
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2 text-muted-slate",
                  isRtl && "flex-row-reverse",
                )}
              >
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="h-[15px] w-[15px] accent-accent-500"
                />
                {t.auth.keepSignedIn}
              </label>
              <a
                href="#"
                className="font-semibold text-accent-500 no-underline hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                {t.auth.forgotPassword}
              </a>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full cursor-pointer rounded-xl bg-accent-500 px-3 py-3.5 text-[15px] font-semibold text-white transition hover:brightness-[0.96] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
            >
              {login.isPending ? t.auth.signingIn : t.auth.signIn}
            </button>
          </form>

          <p className="mt-5 text-center text-[13.5px] text-muted-slate">
            {t.auth.newToBusinessOS}{" "}
            <Link
              href={routes.signup}
              className="font-semibold text-accent-500 no-underline hover:underline"
            >
              {t.auth.createShopAccount}
            </Link>
          </p>

          <div className="mt-[22px] rounded-xl border border-dashed border-[color-mix(in_srgb,#FF6A2B_40%,#E7EBF2)] bg-[color-mix(in_srgb,#FF6A2B_8%,#FFFFFF)] px-3.5 py-[11px] text-center text-xs text-muted-slate">
            {t.auth.demoLoginPrefix}{" "}
            <b className="font-display font-bold text-foreground">
              {t.auth.demoLoginCredentials}
            </b>
          </div>
        </div>
      </section>
    </div>
  );
}
