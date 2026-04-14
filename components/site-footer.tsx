"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getMarketing } from "@/content";
import { SocialLinks } from "@/components/social-links";
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
      style={{ marginTop: "auto" }}
    >
      <div className="u-inner">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-lg)",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <p className="u-muted" style={{ margin: 0 }}>
            {c.footerTagline}
          </p>
          <nav aria-label="Footer">
            <ul
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-md)",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              <li>
                <Link href={`/${lang}/faq`}>{c.nav.faq}</Link>
              </li>
              <li>
                <Link href={`/${lang}/trust`}>{c.nav.trust}</Link>
              </li>
              <li>
                <Link href={`/${lang}/privacy`}>{c.nav.privacy}</Link>
              </li>
              <li>
                <Link href={`/${lang}/terms`}>{c.nav.terms}</Link>
              </li>
            </ul>
          </nav>
        </div>
        <SocialLinks heading={c.footerFollowUs} />
        <p className="u-caption" style={{ marginTop: "var(--space-md)", marginBottom: 0 }}>
          {c.footerRights}
        </p>
      </div>
    </footer>
  );
}
