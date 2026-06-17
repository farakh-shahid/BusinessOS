"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "@business-os/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { useLocale } from "@/core/i18n/locale-context";
import { routes } from "@/core/config/routes";
import { isAdminRole } from "@/core/auth/roles";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "@/tailor/infrastructure/api/hooks/use-settings";
import { SettingsFormSkeleton } from "@/tailor/ui/skeletons";
import { BackLink } from "@/tailor/ui/shared/back-link";
import { PageHeader } from "@/tailor/ui/shared/page-header";
import { SettingsMyProfilePanel } from "@/tailor/ui/settings/settings-my-profile-panel";
import {
  SettingsSectionNav,
  type SettingsSection,
} from "@/tailor/ui/settings/settings-section-nav";
import { SettingsShopPanel } from "@/tailor/ui/settings/settings-shop-panel";
import { SettingsWhatsAppPanel } from "@/tailor/ui/settings/settings-whatsapp-panel";
import { StaffTeamPanel } from "@/tailor/ui/staff/staff-team-panel";

const SETTINGS_SECTION_KEY = "businessos-settings-section";

function loadSettingsSection(): SettingsSection {
  if (typeof window === "undefined") return "shop";
  const stored = localStorage.getItem(SETTINGS_SECTION_KEY);
  if (stored === "whatsapp" || stored === "team") return stored;
  return "shop";
}

export function SettingsView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";
  const { data: user } = useMeQuery();
  const isAdmin = isAdminRole(user?.role);
  const { data, isLoading, isError } = useSettingsQuery();
  const updateSettings = useUpdateSettingsMutation();
  const [section, setSection] = useState<SettingsSection>("shop");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [whatsappFooter, setWhatsappFooter] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSection(loadSettingsSection());
  }, []);

  useEffect(() => {
    if (!data) return;
    setName(data.name);
    setPhone(data.phone ?? "");
    setEmail(data.email ?? "");
    setAddress(data.address ?? "");
    setWhatsappFooter(data.whatsappFooter ?? "");
  }, [data]);

  function handleSectionChange(next: SettingsSection) {
    setSection(next);
    setFeedback(null);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_SECTION_KEY, next);
    }
  }

  async function handleSaveShop() {
    if (!isAdmin) return;
    setFeedback(null);
    setError(null);
    try {
      await updateSettings.mutateAsync({
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
      });
      setFeedback(t.settings.saved);
    } catch {
      setError(t.common.error);
    }
  }

  async function handleSaveWhatsApp() {
    if (!isAdmin) return;
    setFeedback(null);
    setError(null);
    try {
      await updateSettings.mutateAsync({
        name: data?.name ?? name.trim(),
        whatsappFooter: whatsappFooter.trim() || undefined,
      });
      setFeedback(t.settings.saved);
    } catch {
      setError(t.common.error);
    }
  }

  const sectionSubtitle =
    section === "shop"
      ? t.settings.shopSectionSubtitle
      : section === "whatsapp"
        ? t.settings.whatsappSectionSubtitle
        : t.staff.gridSubtitle;

  return (
    <>
      <BackLink href={routes.dashboard} label={t.nav.dashboard} isRtl={isRtl} />

      <PageHeader
        title={t.settings.title}
        subtitle={isAdmin ? sectionSubtitle : t.settings.subtitleStaff}
        isRtl={isRtl}
      />

      {!isAdmin ? (
        <div className="mb-4 space-y-4">
          <SettingsMyProfilePanel isRtl={isRtl} />
        </div>
      ) : null}

      {!isLoading && !isError && data ? (
        <div
          className={cn(
            "mb-4 flex justify-end",
            isRtl && "justify-start",
          )}
        >
          <SettingsSectionNav
            section={section}
            t={t}
            isRtl={isRtl}
            showTeam={isAdmin}
            onChange={handleSectionChange}
          />
        </div>
      ) : null}

      {isLoading ? (
        <SettingsFormSkeleton />
      ) : isError || !data ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {t.common.error}
        </div>
      ) : (
        <div className="space-y-4">
          {isAdmin && section === "shop" ? (
            <SettingsShopPanel
              t={t}
              isRtl={isRtl}
              isAdmin={isAdmin}
              name={name}
              phone={phone}
              email={email}
              address={address}
              feedback={feedback}
              error={error}
              isSaving={updateSettings.isPending}
              onNameChange={setName}
              onPhoneChange={setPhone}
              onEmailChange={setEmail}
              onAddressChange={setAddress}
              onSave={() => void handleSaveShop()}
            />
          ) : null}

          {isAdmin && section === "whatsapp" ? (
            <SettingsWhatsAppPanel
              t={t}
              isRtl={isRtl}
              isAdmin={isAdmin}
              whatsappFooter={whatsappFooter}
              feedback={feedback}
              error={error}
              isSaving={updateSettings.isPending}
              onWhatsappFooterChange={setWhatsappFooter}
              onSave={() => void handleSaveWhatsApp()}
            />
          ) : null}

          {isAdmin && section === "team" ? (
            <StaffTeamPanel t={t} isRtl={isRtl} showHeader={false} />
          ) : null}

          {!isAdmin ? (
            <>
              <SettingsShopPanel
                t={t}
                isRtl={isRtl}
                isAdmin={false}
                name={name}
                phone={phone}
                email={email}
                address={address}
                feedback={null}
                error={null}
                isSaving={false}
                onNameChange={setName}
                onPhoneChange={setPhone}
                onEmailChange={setEmail}
                onAddressChange={setAddress}
                onSave={() => undefined}
              />
              <SettingsWhatsAppPanel
                t={t}
                isRtl={isRtl}
                isAdmin={false}
                whatsappFooter={whatsappFooter}
                feedback={null}
                error={null}
                isSaving={false}
                onWhatsappFooterChange={setWhatsappFooter}
                onSave={() => undefined}
              />
            </>
          ) : null}
        </div>
      )}
    </>
  );
}
