"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getMarketing } from "@/content";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";

export function SiteFooter() {
  const pathname = usePathname();
  const rawLang = pathname.split("/").filter(Boolean)[0];
  const lang: Locale = rawLang && isLocale(rawLang) ? rawLang : "hy";
  const c = getMarketing(lang);

  return (
    <footer
      className="u-page-padding u-section u-section--tint"
      style={{ borderTop: "1px solid var(--color-outline-variant)", marginTop: "auto" }}
    >
      <div className="u-inner">
        <div className="footer-inner">
          {/* Left: brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: "var(--color-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Red Auto
            </div>
            <p
              style={{
                color: "var(--color-on-surface)",
                maxWidth: 360,
                margin: 0,
                lineHeight: 1.5,
                fontSize: 16,
              }}
            >
              {c.footerTagline}
            </p>
          </div>

          {/* Right: nav columns */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "32px 64px", justifyContent: "flex-end", alignItems: "flex-start" }}>
            {/* Resources column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <span
                className="u-label-caps"
                style={{ color: "var(--color-primary)" }}
              >
                {c.footerResourcesLabel}
              </span>
              <Link href={`/${lang}/trust`} className="footer-link">
                {c.nav.trust}
              </Link>
              <Link href={`/${lang}/privacy`} className="footer-link">
                {c.nav.privacy}
              </Link>
              <Link href={`/${lang}/terms`} className="footer-link">
                {c.nav.terms}
              </Link>
            </div>

            {/* Help column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <span
                className="u-label-caps"
                style={{ color: "var(--color-primary)" }}
              >
                {c.footerHelpLabel}
              </span>
              <Link href={`/${lang}#contact`} className="footer-link">
                {c.nav.contactUs}
              </Link>
              <Link href={`/${lang}/faq`} className="footer-link">
                {c.nav.faq}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 768px) {
          .footer-inner {
            grid-template-columns: 1fr auto;
            align-items: start;
          }
        }
        .footer-link {
          color: var(--color-on-surface-variant);
          font-size: 16px;
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover {
          color: var(--color-primary);
          text-decoration: none;
        }
      `}</style>
    </footer>
  );
}
