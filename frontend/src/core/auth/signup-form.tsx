"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { isValidPakistanPhone } from "@shared";
import { getDictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { FormFieldError } from "@/core/presentation/components/ui/form-field-error";
import { PakistanPhoneField } from "@/core/presentation/components/ui/pakistan-phone-field";
import { ApiError } from "@/core/infrastructure/api/api-client";
import { resolveApiErrorMessage } from "@/core/presentation/lib/resolve-api-error";
import { useSignupMutation } from "@/features/infrastructure/api/hooks/use-auth";
import { LanguageToggle } from "@/features/ui/layout/language-toggle";
import { BrandLogo } from "@/features/ui/shared/brand-logo";

const signupSteps = [
  { title: "step1Title", sub: "step1Sub" },
  { title: "step2Title", sub: "step2Sub" },
  { title: "step3Title", sub: "step3Sub" },
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

export function SignupForm() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const s = t.auth.signup;
  const isRtl = locale === "ur";
  const signup = useSignupMutation();

  const [shopName, setShopName] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const passwordTooShort = password.trim().length > 0 && password.trim().length < 8;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitted(true);

    if (
      !shopName.trim() ||
      !name.trim() ||
      !isValidPakistanPhone(phone.trim()) ||
      password.trim().length < 8 ||
      !acceptedTerms
    ) {
      return;
    }

    try {
      await signup.mutateAsync({
        shopName: shopName.trim(),
        name: name.trim(),
        phone: phone.trim(),
        password: password.trim(),
      });
      router.replace(routes.dashboard);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError(t.errors.phoneAlreadyRegistered);
      } else {
        setError(resolveApiErrorMessage(err, t));
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

        <BrandLogo
          solutionsLabel={t.brand.solutionsChip}
          isRtl={isRtl}
          className="relative z-[1]"
        />

        <div className="relative z-[1] my-6 max-w-[430px] lg:my-auto">
          <h1 className="font-display text-[27px] font-bold leading-[1.14] tracking-[-0.02em] sm:text-[36px]">
            {s.headlinePrefix}{" "}
            <span className="text-accent-500">{s.headlineAccent}</span>
          </h1>
          <p className="mt-3.5 text-[15px] leading-relaxed text-white/66">
            {s.headlineSub}
          </p>

          <div className="mt-[30px] hidden flex-col gap-[18px] lg:flex">
            {signupSteps.map((step, index) => (
              <div
                key={step.title}
                className={cn(
                  "flex items-start gap-3.5",
                  isRtl && "flex-row-reverse text-right",
                )}
              >
                <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] bg-white/10 font-display text-[13px] font-bold text-accent-500">
                  {index + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold">
                    {s[step.title]}
                  </div>
                  <div className="mt-px text-[12.5px] text-white/55">
                    {s[step.sub]}
                  </div>
                </div>
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

        <div className="mx-auto my-auto w-full max-w-[430px] py-8 lg:py-0">
          <h2 className="font-display text-[25px] font-bold tracking-[-0.01em] text-foreground">
            {s.formTitle}
          </h2>
          <p className="mt-1.5 text-sm text-muted-slate">{s.formSub}</p>

          <button
            type="button"
            disabled
            className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-hairline bg-card px-3 py-3 text-sm font-semibold text-foreground opacity-70"
            aria-disabled
            title={s.signUpWithGoogle}
          >
            <GoogleIcon />
            {s.signUpWithGoogle}
          </button>

          <div className="my-[18px] flex items-center gap-3 text-xs text-muted-slate">
            <span className="h-px flex-1 bg-hairline" />
            {s.orWithPhone}
            <span className="h-px flex-1 bg-hairline" />
          </div>

          <form onSubmit={handleSubmit}>
            {error ? (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="mb-3.5">
              <label
                htmlFor="shopName"
                className="mb-1.5 block text-[12.5px] font-semibold text-foreground"
              >
                {s.shopName}
              </label>
              <input
                id="shopName"
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder={s.shopNamePlaceholder}
                required
                className="w-full rounded-[11px] border border-hairline bg-card px-3.5 py-3 text-sm text-foreground placeholder:text-muted-slate focus:border-accent-500 focus:outline-none focus:ring-[3px] focus:ring-accent-50"
              />
            </div>

            <div className="mb-3.5">
              <label
                htmlFor="ownerName"
                className="mb-1.5 block text-[12.5px] font-semibold text-foreground"
              >
                {s.yourName}
              </label>
              <input
                id="ownerName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={s.yourNamePlaceholder}
                required
                className="w-full rounded-[11px] border border-hairline bg-card px-3.5 py-3 text-sm text-foreground placeholder:text-muted-slate focus:border-accent-500 focus:outline-none focus:ring-[3px] focus:ring-accent-50"
              />
            </div>

            <div className="mb-3.5">
              <PakistanPhoneField
                id="signup-phone"
                label={s.phone}
                value={phone}
                onChange={setPhone}
                placeholder={s.phonePlaceholder}
                hint={t.form.phoneHint}
                invalidMessage={t.validation.phoneInvalid}
                forceShowError={submitted}
              />
            </div>

            <div className="mb-3.5">
              <label
                htmlFor="signup-password"
                className="mb-1.5 block text-[12.5px] font-semibold text-foreground"
              >
                {t.auth.password}
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={s.createPassword}
                  autoComplete="new-password"
                  dir="ltr"
                  required
                  minLength={8}
                  className={cn(
                    "w-full rounded-[11px] border bg-card py-3 text-sm text-foreground placeholder:text-muted-slate focus:outline-none focus:ring-[3px]",
                    isRtl ? "pl-11 pr-3.5" : "pr-11 pl-3.5",
                    passwordTooShort && submitted
                      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                      : "border-hairline focus:border-accent-500 focus:ring-accent-50",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 text-muted-slate transition hover:text-foreground",
                    isRtl ? "left-3" : "right-3",
                  )}
                  aria-label={
                    showPassword ? t.auth.hidePassword : t.auth.showPassword
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FormFieldError
                message={
                  submitted && passwordTooShort ? s.passwordTooShort : undefined
                }
              />
              <p className="mt-1.5 text-[11.5px] text-muted-slate">{s.passwordHint}</p>
            </div>

            <label
              className={cn(
                "mb-5 flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-slate",
                isRtl && "flex-row-reverse text-right",
              )}
            >
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-px h-4 w-4 shrink-0 accent-accent-500"
              />
              <span>
                {s.termsPrefix}{" "}
                <a href="#" className="font-semibold text-accent-500 no-underline">
                  {s.termsOfService}
                </a>{" "}
                {s.termsAnd}{" "}
                <a href="#" className="font-semibold text-accent-500 no-underline">
                  {s.privacyPolicy}
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={signup.isPending}
              className="w-full cursor-pointer rounded-xl bg-accent-500 px-3 py-3.5 text-[15px] font-semibold text-white transition hover:brightness-[0.96] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
            >
              {signup.isPending ? s.creatingAccount : s.createButton}
            </button>
          </form>

          <p className="mt-[18px] text-center text-[13.5px] text-muted-slate">
            {s.alreadyHaveAccount}{" "}
            <Link
              href={routes.login}
              className="font-semibold text-accent-500 no-underline hover:underline"
            >
              {s.signIn}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
