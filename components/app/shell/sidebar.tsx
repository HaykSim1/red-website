"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import type { Locale } from "@/lib/i18n";

import { PRIMARY_NAV_KEYS, visibleNavItems } from "./nav-items";

type SidebarProps = {
  lang: Locale;
  isSeller: boolean;
  activeKey: string;
  /** True below lg, where the sidebar is an overlay dialog rather than page chrome. */
  isOverlay: boolean;
  open: boolean;
  onNavigate: () => void;
  onClose: () => void;
  navId: string;
};

export function Sidebar({
  lang,
  isSeller,
  activeKey,
  isOverlay,
  open,
  onNavigate,
  onClose,
  navId,
}: SidebarProps) {
  const { t } = useTranslation();
  const items = visibleNavItems(isSeller);
  const primary = items.filter((i) => PRIMARY_NAV_KEYS.has(i.key));
  const secondary = items.filter((i) => !PRIMARY_NAV_KEYS.has(i.key));

  return (
    <aside
      id={navId}
      // Off-canvas below lg. `inert` keeps the closed drawer out of the tab order
      // and away from screen readers — hiding it with a transform alone does not.
      inert={isOverlay && !open ? true : undefined}
      {...(isOverlay ? { role: "dialog", "aria-modal": true, "aria-label": t("web.openMenu") } : {})}
      className={[
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col",
        "border-r border-outline-variant/10 bg-surface-container-low",
        "transition-transform duration-200 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          href={`/${lang}/app`}
          onClick={onNavigate}
          className="rounded leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {/* The real mark already carries the "RED" wordmark, so it stands alone
              here exactly as it does in the marketing header. The source PNG is
              500x500 with the artwork occupying only the middle ~60%/56%, so the
              box has to be noticeably larger than the mark should appear. */}
          <Image src="/logo.png" alt="Red Auto" width={500} height={500} priority className="h-20 w-auto" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("web.closeMenu")}
          className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-variant/50 lg:hidden"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav aria-label={t("web.dashboard")} className="flex-1 space-y-1 overflow-y-auto px-4">
        {primary.map((item) => (
          <NavLink
            key={item.key}
            href={`/${lang}/app${item.path}`}
            icon={item.icon}
            active={activeKey === item.key}
            onClick={onNavigate}
          >
            {item.label(t)}
          </NavLink>
        ))}

        <div className="mx-4 my-4 border-t border-outline-variant/20" />

        {secondary.map((item) => (
          <NavLink
            key={item.key}
            href={`/${lang}/app${item.path}`}
            icon={item.icon}
            active={activeKey === item.key}
            onClick={onNavigate}
          >
            {item.label(t)}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <Link
          href={`/${lang}/app/requests/new`}
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-sm font-bold tracking-wide text-on-primary transition-colors hover:bg-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="material-symbols-outlined">add_circle</span>
          {t("web.newRequest")}
        </Link>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  active,
  onClick,
  children,
}: {
  href: string;
  icon: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={[
        "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active
          ? "bg-primary-container text-on-primary-container shadow-sm"
          : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface",
      ].join(" ")}
    >
      <span className="material-symbols-outlined mr-4 text-[22px]">{icon}</span>
      {children}
    </Link>
  );
}
