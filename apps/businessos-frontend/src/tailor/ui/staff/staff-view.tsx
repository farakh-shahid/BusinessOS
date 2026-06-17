"use client";

import { getDictionary } from "@business-os/i18n";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { BackLink } from "@/tailor/ui/shared/back-link";
import { PageHeader } from "@/tailor/ui/shared/page-header";
import { StaffTeamPanel } from "@/tailor/ui/staff/staff-team-panel";

export function StaffView() {
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const isRtl = locale === "ur";

  return (
    <>
      <BackLink href={routes.settings} label={t.settings.title} isRtl={isRtl} />

      <PageHeader
        title={t.staff.title}
        subtitle={t.staff.gridSubtitle}
        isRtl={isRtl}
      />

      <StaffTeamPanel t={t} isRtl={isRtl} />
    </>
  );
}
