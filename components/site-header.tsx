"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getMarketing } from "@/content";
import type { Locale } from "@/lib/i18n";
import { isLocale, locales } from "@/lib/i18n";

const NAV_SEGMENTS = new Set(["privacy", "terms", "faq", "trust"]);

function segmentFromPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  const second = parts[1];
  if (second && NAV_SEGMENTS.has(second)) return second;
  return "";
}

export function SiteHeader() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const rawLang = parts[0];
  const lang: Locale = rawLang && isLocale(rawLang) ? rawLang : "hy";
  const c = getMarketing(lang);
  const segment = segmentFromPath(pathname);
  const currentSegment = segment || "home";
  const suffix = segment ? `/${segment}` : "";

  return (
    <header
      className="u-page-padding"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-outline-variant)",
      }}
    >
      <div
        className="u-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-md)",
          height: 80,
        }}
      >
        {/* Logo */}
        <Link href={`/${lang}`} style={{ lineHeight: 0, flexShrink: 0 }}>
          <Image
            src="/logo.png"
            alt="Red Auto"
            width={115}
            height={115}
            style={{ display: "block" }}
            priority
          />
        </Link>

        {/* Primary nav */}
        <nav aria-label="Primary" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <NavLink
            href={`/${lang}#how-it-works`}
            active={currentSegment === "home"}
          >
            {c.nav.howItWorks}
          </NavLink>
          <NavLink
            href={`/${lang}#audiences`}
            active={false}
            className="hide-md"
          >
            {c.nav.forBuyers}
          </NavLink>
          <NavLink
            href={`/${lang}#audiences`}
            active={false}
            className="hide-md"
          >
            {c.nav.forSellers}
          </NavLink>
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <Link
            href={`/${lang}#contact`}
            className="u-label-caps hide-sm"
            style={{
              color: "var(--color-on-surface-variant)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
          >
            {c.nav.contactUs}
          </Link>
          <Link
            href={`/${lang}/login`}
            className="u-label-caps"
            style={{
              color: "var(--color-primary)",
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "color 0.15s",
            }}
          >
            {c.nav.logIn}
          </Link>
          <Link
            href="#download"
            className="u-gradient-cta hide-sm"
            style={{ padding: "10px 20px", fontSize: 14 }}
          >
            {c.heroCtaDownload}
          </Link>

          {/* Lang switcher */}
          <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}${suffix}`}
                hrefLang={l}
                style={{
                  fontSize: 12,
                  fontWeight: l === lang ? 700 : 500,
                  color: l === lang ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                  textDecoration: "none",
                  letterSpacing: "0.03em",
                }}
              >
                {c.langSwitcher[l]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) { .hide-sm { display: none !important; } }
        @media (max-width: 1023px) { .hide-md { display: none !important; } }
      `}</style>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
  className = "",
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      style={{
        fontSize: 16,
        fontWeight: active ? 700 : 400,
        color: active ? "var(--color-primary)" : "var(--color-on-surface-variant)",
        textDecoration: "none",
        borderBottom: active ? "2px solid var(--color-primary)" : "2px solid transparent",
        paddingBottom: 4,
        transition: "color 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Link>
  );
}
