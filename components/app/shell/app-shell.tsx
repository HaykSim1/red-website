"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useMe } from "@/hooks/app/use-me";
import { useRealtimeSync } from "@/hooks/app/use-realtime-sync";
import { useRoleWatcher } from "@/hooks/app/use-role-watcher";
import type { Locale } from "@/lib/i18n";

import { BottomTabs } from "./bottom-tabs";
import { NAV_ITEMS } from "./nav-items";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const NAV_ID = "app-nav";

/** Longest matching nav path wins, so /requests/new still highlights "My requests". */
function activeNavKey(pathname: string, lang: Locale): string {
  const prefix = `/${lang}/app`;
  const rest = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : "";
  let best = "dashboard";
  let bestLength = -1;
  for (const item of NAV_ITEMS) {
    const matches = item.path === "" ? rest === "" || rest === "/" : rest.startsWith(item.path);
    if (matches && item.path.length > bestLength) {
      best = item.key;
      bestLength = item.path.length;
    }
  }
  return best;
}

export function AppShell({ lang, children }: { lang: Locale; children: ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isSeller } = useMe();

  // Live cache invalidation, and the poll that turns an approved seller
  // application into seller permissions without a re-login.
  useRealtimeSync();
  useRoleWatcher();

  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const wasOpen = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  // Read the media query after mount — window does not exist during SSR, and
  // defaulting to desktop keeps the drawer out of the tab order on first paint.
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const sync = () => {
      setIsDesktop(mql.matches);
      // Crossing up to desktop turns the drawer back into page chrome; leaving
      // `open` set would strand the scrim over the content.
      if (mql.matches) setOpen(false);
    };
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Lock the page behind the drawer, restoring whatever overflow was there before.
  useEffect(() => {
    if (!open || isDesktop) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isDesktop]);

  // Send focus into the drawer when it opens and back to the hamburger when it
  // closes, so keyboard users are never dropped at the top of the document.
  useEffect(() => {
    if (open && !isDesktop) {
      wasOpen.current = true;
      document.getElementById(NAV_ID)?.querySelector<HTMLElement>("a, button")?.focus();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      document.getElementById("app-nav-toggle")?.focus();
    }
  }, [open, isDesktop]);

  const activeKey = activeNavKey(pathname, lang);
  const activeItem = NAV_ITEMS.find((i) => i.key === activeKey);
  const isOverlay = !isDesktop;

  return (
    <div className="app-root">
      <Sidebar
        lang={lang}
        isSeller={isSeller}
        activeKey={activeKey}
        isOverlay={isOverlay}
        open={open || isDesktop}
        onNavigate={close}
        onClose={close}
        navId={NAV_ID}
      />

      {open && !isDesktop ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={close}
          className="fixed inset-0 z-40 cursor-default bg-inverse-surface/40 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <div className="pl-0 lg:pl-72">
        <Topbar
          lang={lang}
          title={activeItem ? activeItem.label(t) : t("web.dashboard")}
          onOpenMenu={() => setOpen(true)}
          menuOpen={open}
          navId={NAV_ID}
        />

        {/* pb-20 clears the phone tab bar; md+ has none. */}
        <main className="min-h-svh pt-16 pb-20 md:pb-0 lg:pt-20">{children}</main>
      </div>

      <BottomTabs lang={lang} isSeller={isSeller} activeKey={activeKey} />
    </div>
  );
}
