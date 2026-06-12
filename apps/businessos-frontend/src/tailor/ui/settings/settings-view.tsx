"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { isAdminRole } from "@/core/auth/roles";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { Card, CardTitle } from "@/core/presentation/components/ui/card";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "@/tailor/infrastructure/api/hooks/use-settings";
import { SettingsFormSkeleton } from "@/tailor/ui/skeletons";

export function SettingsView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const isAdmin = isAdminRole(user?.role);
  const { data, isLoading, isError } = useSettingsQuery();
  const updateSettings = useUpdateSettingsMutation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [whatsappFooter, setWhatsappFooter] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setName(data.name);
    setPhone(data.phone ?? "");
    setEmail(data.email ?? "");
    setAddress(data.address ?? "");
    setWhatsappFooter(data.whatsappFooter ?? "");
  }, [data]);

  async function handleSave() {
    if (!isAdmin) return;
    setFeedback(null);
    setError(null);
    try {
      await updateSettings.mutateAsync({
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        whatsappFooter: whatsappFooter.trim() || undefined,
      });
      setFeedback(t.settings.saved);
    } catch {
      setError(t.common.error);
    }
  }

  return (
    <>
      <div className="mb-4">
        <Link
          href={routes.dashboard}
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          ← {t.nav.dashboard}
        </Link>
        <h2 className="mt-2 text-lg font-bold text-slate-900 md:text-2xl">
          {t.settings.title}
        </h2>
        <p className="text-sm text-slate-500">{t.settings.subtitle}</p>
      </div>

      {isLoading ? (
        <SettingsFormSkeleton />
      ) : isError || !data ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      ) : (
        <Card>
          <CardTitle>{t.settings.shopDetails}</CardTitle>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="shop-name">{t.settings.shopName}</Label>
              <Input
                id="shop-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isAdmin}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="shop-phone">{t.form.phone}</Label>
                <Input
                  id="shop-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isAdmin}
                  dir="ltr"
                />
              </div>
              <div>
                <Label htmlFor="shop-email">{t.form.email}</Label>
                <Input
                  id="shop-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isAdmin}
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="shop-address">{t.settings.address}</Label>
              <Textarea
                id="shop-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!isAdmin}
              />
            </div>
            <div>
              <Label htmlFor="shop-wa-footer">{t.settings.whatsappFooter}</Label>
              <Textarea
                id="shop-wa-footer"
                value={whatsappFooter}
                onChange={(e) => setWhatsappFooter(e.target.value)}
                disabled={!isAdmin}
                placeholder={t.settings.whatsappFooterPlaceholder}
              />
            </div>

            {!isAdmin && (
              <p className="text-sm text-slate-500">{t.settings.adminOnly}</p>
            )}

            {feedback && (
              <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {feedback}
              </p>
            )}
            {error && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            )}

            {isAdmin && (
              <div className={cn("flex gap-2", isRtl && "flex-row-reverse")}>
                <Link href={routes.staff}>
                  <Button variant="outline">{t.settings.manageStaff}</Button>
                </Link>
                <Button
                  onClick={handleSave}
                  disabled={updateSettings.isPending}
                >
                  {updateSettings.isPending
                    ? t.settings.saving
                    : t.settings.save}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
}
