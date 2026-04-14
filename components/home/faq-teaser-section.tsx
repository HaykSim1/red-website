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
    <section className="u-section u-page-padding u-section--tint">
      <div className="u-inner">
        <div className="u-card" style={{ maxWidth: 720 }}>
          <h2 className="u-screen-title" style={{ marginBottom: "var(--space-md)" }}>
            {t.title}
          </h2>
          <p className="u-muted" style={{ marginBottom: "var(--space-lg)" }}>
            {t.body}
          </p>
          <Link className="u-gradient-cta" href={`/${lang}/faq`}>
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
