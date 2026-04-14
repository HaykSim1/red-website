import Link from "next/link";

import type { MarketingContent } from "@/content/types";

interface HeroSectionProps {
  content: MarketingContent;
}

export function HeroSection({ content: c }: HeroSectionProps) {
  return (
    <section
      className="u-section u-page-padding"
      style={{ background: "var(--color-surface-container-low)" }}
    >
      <div className="u-inner">
        <h1 className="u-display" style={{ marginBottom: "var(--space-md)", maxWidth: 720 }}>
          {c.heroTitle}
        </h1>
        <p className="u-body" style={{ marginBottom: "var(--space-xl)", maxWidth: 640 }}>
          {c.heroSubtitle}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)" }}>
          <Link className="u-gradient-cta" href="#download">
            {c.downloadSectionTitle}
          </Link>
          <Link
            href="#how-it-works"
            style={{
              alignSelf: "center",
              padding: "12px 16px",
              borderRadius: "var(--radius-button)",
              background: "var(--color-surface-container-lowest)",
              color: "var(--color-on-surface)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {c.heroCtaHowItWorks}
          </Link>
        </div>
        <p className="u-caption" style={{ marginTop: "var(--space-xl)", maxWidth: 640, marginBottom: 0 }}>
          {c.disclaimerLine}
        </p>
      </div>
    </section>
  );
}
