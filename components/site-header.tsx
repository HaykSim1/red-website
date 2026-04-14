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
  const suffix = segment ? `/${segment}` : "";

  return (
    <header
      className="u-page-padding"
      style={{
        background: "var(--color-surface-container-lowest)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        className="u-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-md)",
          paddingTop: "var(--space-md)",
          paddingBottom: "var(--space-md)",
        }}
      >
        <Link
          href={`/${lang}`}
          className="u-link-plain"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-sm)",
            textDecoration: "none",
          }}
        >
          <Image src="/logo.png" alt="Red Auto" width={40} height={40} priority />
          <span className="u-screen-title" style={{ fontSize: 18 }}>
            Red Auto
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-md)",
              listStyle: "none",
              margin: 0,
              padding: 0,
              alignItems: "center",
            }}
          >
            <li>
              <Link href={`/${lang}`} className="u-body u-link-plain">
                {c.nav.home}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/faq`} className="u-body u-link-plain">
                {c.nav.faq}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/trust`} className="u-body u-link-plain">
                {c.nav.trust}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/privacy`} className="u-body u-link-plain">
                {c.nav.privacy}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/terms`} className="u-body u-link-plain">
                {c.nav.terms}
              </Link>
            </li>
            <li
              style={{
                display: "flex",
                gap: "var(--space-xs)",
                marginLeft: "var(--space-sm)",
              }}
            >
              {locales.map((l) => (
                <Link
                  key={l}
                  href={`/${l}${suffix}`}
                  className="u-caption"
                  style={{
                    fontWeight: l === lang ? 700 : 500,
                    textDecoration: l === lang ? "underline" : "none",
                  }}
                  hrefLang={l}
                >
                  {c.langSwitcher[l]}
                </Link>
              ))}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
