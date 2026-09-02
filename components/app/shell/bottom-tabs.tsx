"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/lib/i18n";

import { visibleNavItems } from "./nav-items";

/**
 * Phone-width navigation, matching the Stitch mobile screens. Only the items
 * flagged inBottomBar appear; everything else stays reachable via the drawer.
 */
export function BottomTabs({
  lang,
  isSeller,
  activeKey,
}: {
  lang: Locale;
  isSeller: boolean;
  activeKey: string;
}) {
  const { t } = useTranslation();
  const items = visibleNavItems(isSeller).filter((i) => i.inBottomBar);

  return (
    <nav
      aria-label={t("web.dashboard")}
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-outline-variant/20 bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {items.map((item) => {
        const active = activeKey === item.key;
        return (
          <Link
            key={item.key}
            href={`/${lang}/app${item.path}`}
            aria-current={active ? "page" : undefined}
            className={[
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2",
              active ? "text-primary" : "text-on-surface-variant",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="text-[10px] font-semibold leading-tight">{item.label(t)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
