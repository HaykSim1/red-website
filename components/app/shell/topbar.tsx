"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { useMe } from "@/hooks/app/use-me";
import type { Locale } from "@/lib/i18n";

export function Topbar({
  lang,
  title,
  onOpenMenu,
  menuOpen,
  navId,
}: {
  lang: Locale;
  title: string;
  onOpenMenu: () => void;
  menuOpen: boolean;
  navId: string;
}) {
  const { t } = useTranslation();
  const { me, role } = useMe();

  const roleLabel =
    role === "seller" ? t("web.roleSeller") : role === "admin" ? t("web.roleAdmin") : t("web.roleBuyer");

  return (
    // z-30 below lg so the drawer scrim (z-40) covers the header; z-40 at lg+
    // where the sidebar is page chrome and nothing overlays it.
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center gap-3 border-b border-outline-variant/10 bg-surface/85 px-4 backdrop-blur-xl sm:px-6 lg:left-72 lg:z-40 lg:h-20 lg:px-8">
      <button
        type="button"
        id="app-nav-toggle"
        onClick={onOpenMenu}
        aria-label={menuOpen ? t("web.closeMenu") : t("web.openMenu")}
        aria-expanded={menuOpen}
        aria-controls={navId}
        className="-ml-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-variant/50 lg:hidden"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <h1 className="truncate font-headline text-lg font-bold tracking-tight text-on-surface lg:text-xl">
        {title}
      </h1>

      <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-6">
        <Link
          href={`/${lang}/app/profile`}
          className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-surface-variant/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="hidden text-right sm:block">
            <span className="block text-sm font-bold text-on-surface">
              {me?.display_name?.trim() || me?.phone || "—"}
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {roleLabel}
            </span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <span className="material-symbols-outlined text-[18px] text-on-primary">person</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
