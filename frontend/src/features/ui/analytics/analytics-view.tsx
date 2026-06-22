"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n";
import { routes } from "@/core/config/routes";
import { useLocale } from "@/core/i18n/locale-context";
import { useAnalyticsQuery } from "@/features/infrastructure/api/hooks/use-analytics";
import {
  AnalyticsOverview,
  type OverviewScope,
} from "./analytics-overview";
import { AnalyticsPeriodView } from "./analytics-period-view";
import { AnalyticsTabNav, type AnalyticsTab } from "./analytics-tab-nav";
import {
  clampAnchorToTenant,
  shiftAnchor,
  toDateInputValue,
} from "./analytics-date-utils";
import {
  buildAnalyticsExportLabels,
  exportAnalyticsCsv,
  exportAnalyticsPdf,
} from "./export-analytics";
import { AnalyticsSkeleton } from "@/features/ui/skeletons";
import { BackLink } from "@/features/ui/shared/back-link";
import { PageHeader } from "@/features/ui/shared/page-header";

export function AnalyticsView() {
  const { locale } = useLocale();
  const isRtl = locale === "ur";
  const t = getDictionary(locale);

  const [tab, setTab] = useState<AnalyticsTab>("overview");
  const [overviewScope, setOverviewScope] = useState<OverviewScope>("year");
  const [view, setView] = useState<"week" | "month">("week");
  const [anchor, setAnchor] = useState(() => toDateInputValue(new Date()));
  /** Optional drill-down within the visible week/month (period tab only). */
  const [focusedDay, setFocusedDay] = useState<string | null>(null);

  const { data, isLoading, isError } = useAnalyticsQuery({
    view,
    anchor,
    focus: tab === "period" && focusedDay ? focusedDay : undefined,
    overviewScope: tab === "overview" ? overviewScope : undefined,
  });

  useEffect(() => {
    if (!data) return;
    const clamped = clampAnchorToTenant(anchor, data.tenantCreatedAt);
    if (clamped !== anchor) setAnchor(clamped);
  }, [data, anchor]);

  function handleJumpToPeriod(date: string) {
    setAnchor(date);
    setFocusedDay(null);
  }

  function handleSelectDay(date: string) {
    setFocusedDay((current) => (current === date ? null : date));
  }

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-status-rush/20 bg-status-rush-bg px-4 py-16 text-center text-sm text-status-rush">
        {t.common.error}
      </div>
    );
  }

  const analyticsData = data;
  const exportLabels = buildAnalyticsExportLabels(t, analyticsData.viewMode);

  function handlePdfExport() {
    exportAnalyticsPdf(analyticsData, exportLabels);
  }

  return (
    <div>
      <BackLink href={routes.dashboard} label={t.nav.dashboard} isRtl={isRtl} />

      <PageHeader
        title={t.analytics.overviewTitle}
        subtitle={t.analytics.overviewSubtitle.replace("{shop}", analyticsData.shopName)}
        actions={
          <AnalyticsTabNav tab={tab} t={t} isRtl={isRtl} onChange={setTab} />
        }
        isRtl={isRtl}
      />

      {tab === "overview" ? (
        <AnalyticsOverview
          data={analyticsData}
          t={t}
          isRtl={isRtl}
          scope={overviewScope}
          onScopeChange={setOverviewScope}
          onGoToPeriod={() => setTab("period")}
        />
      ) : (
        <AnalyticsPeriodView
          data={analyticsData}
          t={t}
          isRtl={isRtl}
          anchor={anchor}
          focusedDay={focusedDay}
          onSelectDay={handleSelectDay}
          onJumpToPeriod={handleJumpToPeriod}
          onPrevious={() => {
            if (!analyticsData.canGoPrevious) return;
            setAnchor(shiftAnchor(anchor, view, -1));
            setFocusedDay(null);
          }}
          onNext={() => {
            if (!analyticsData.canGoNext) return;
            setAnchor(shiftAnchor(anchor, view, 1));
            setFocusedDay(null);
          }}
          onViewChange={(nextView) => {
            setView(nextView);
            setAnchor(clampAnchorToTenant(anchor, analyticsData.tenantCreatedAt));
            setFocusedDay(null);
          }}
          onExportCsv={() => exportAnalyticsCsv(analyticsData, exportLabels)}
          onExportPdf={handlePdfExport}
        />
      )}
    </div>
  );
}
