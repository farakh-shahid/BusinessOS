"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { cn } from "@/core/presentation/lib/utils";
import { Button } from "@/core/presentation/components/ui/button";
import { Label } from "@/core/presentation/components/ui/label";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { WhatsAppConnectionCard } from "./whatsapp-connection-card";
import { SettingsPanel } from "./settings-section-nav";

interface SettingsWhatsAppPanelProps {
  t: Dictionary;
  isRtl: boolean;
  isAdmin: boolean;
  whatsappFooter: string;
  feedback: string | null;
  error: string | null;
  isSaving: boolean;
  onWhatsappFooterChange: (value: string) => void;
  onSave: () => void;
}

export function SettingsWhatsAppPanel({
  t,
  isRtl,
  isAdmin,
  whatsappFooter,
  feedback,
  error,
  isSaving,
  onWhatsappFooterChange,
  onSave,
}: SettingsWhatsAppPanelProps) {
  return (
    <div className="space-y-4">
      <WhatsAppConnectionCard t={t} isRtl={isRtl} isAdmin={isAdmin} embedded />

      <SettingsPanel
        title={t.settings.whatsappMessages}
        description={t.settings.whatsappMessagesHint}
        icon={<MessageCircle className="h-4 w-4" />}
        isRtl={isRtl}
      >
        <div>
          <Label htmlFor="shop-wa-footer">{t.settings.whatsappFooter}</Label>
          <Textarea
            id="shop-wa-footer"
            value={whatsappFooter}
            onChange={(e) => onWhatsappFooterChange(e.target.value)}
            disabled={!isAdmin}
            placeholder={t.settings.whatsappFooterPlaceholder}
            className="mt-1.5 min-h-[96px]"
          />
        </div>

        {!isAdmin ? (
          <p className="mt-4 text-sm text-muted-slate">{t.settings.adminOnly}</p>
        ) : null}

        {feedback ? (
          <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {feedback}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {isAdmin ? (
          <div className={cn("mt-5 flex justify-end", isRtl && "justify-start")}>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? t.settings.saving : t.settings.save}
            </Button>
          </div>
        ) : null}
      </SettingsPanel>
    </div>
  );
}
