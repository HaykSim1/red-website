import Link from "next/link";

import type { MarketingContent } from "@/content/types";
import type { Locale } from "@/lib/i18n";

interface FaqTeaserSectionProps {
  content: MarketingContent;
  lang: Locale;
}

export function FaqTeaserSection({ content: c, lang }: FaqTeaserSectionProps) {
  const t = c.homeFaqTeaser;

  return (
    <section className="u-page-padding" style={{ marginBottom: "var(--section-gap)" }}>
      <div className="u-inner">
        <div
          style={{
            background: "var(--color-surface-container)",
            border: "1px solid var(--color-outline-variant)",
            borderRadius: 8,
            padding: "48px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 32,
          }}
        >
          <div>
            <h3 className="u-headline-md" style={{ marginBottom: 8, color: "var(--color-on-surface)" }}>
              {t.title}
            </h3>
            <p style={{ color: "var(--color-on-surface-variant)", margin: 0 }}>
              {t.body}
            </p>
          </div>
          <Link
            href={`/${lang}/faq`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--color-primary)",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 16,
              whiteSpace: "nowrap",
              transition: "gap 0.15s",
            }}
            className="faq-teaser-link"
          >
            {t.cta}
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
          </Link>
        </div>
      </div>

      <style>{`
        .faq-teaser-link:hover { gap: 16px; text-decoration: none; }
      `}</style>
    </section>
  );
}
