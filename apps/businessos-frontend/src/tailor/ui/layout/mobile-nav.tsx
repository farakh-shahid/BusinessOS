"use client";

import { usePathname } from "next/navigation";
import { getDictionary } from "@business-os/i18n";
import { useLocale } from "@/core/i18n/locale-context";
import { useMeQuery } from "@/tailor/infrastructure/api/hooks/use-auth";
import { getVisibleNavItems, isNavActive, navPath } from "./nav-items";
import { MobileNavLink } from "./sidebar-nav-link";

export function MobileNav() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = getDictionary(locale);
  const { data: user } = useMeQuery();
  const items = getVisibleNavItems(user?.role);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
      <div className="mx-auto max-w-lg overflow-hidden rounded-[1.35rem] border border-sidebar/10 bg-white/95 shadow-xl shadow-sidebar/10 backdrop-blur-xl">
        <div className="scrollbar-hide flex items-stretch gap-0.5 overflow-x-auto px-1.5 py-1.5">
          {items.map(({ segment, icon, labelKey }) => (
            <MobileNavLink
              key={labelKey}
              href={navPath(segment)}
              label={t.nav[labelKey]}
              icon={icon}
              active={isNavActive(pathname, segment)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
