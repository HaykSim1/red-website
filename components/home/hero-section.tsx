import Image from "next/image";
import Link from "next/link";

import type { MarketingContent } from "@/content/types";

interface HeroSectionProps {
  content: MarketingContent;
}

export function HeroSection({ content: c }: HeroSectionProps) {
  const titleParts = c.heroTitle.split(". ");
  const titleLine1 = titleParts[0] + (titleParts.length > 1 ? "." : "");
  const titleLine2 = titleParts.slice(1).join(". ");

  return (
    <section className="u-page-padding hero-section" style={{ paddingTop: 96, paddingBottom: "var(--section-gap)" }}>
      <div className="u-inner hero-inner">
        {/* Text column */}
        <div>
          <h1 className="u-display-lg" style={{ marginBottom: 24, color: "var(--color-on-surface)" }}>
            {titleLine1}
            {titleLine2 && (
              <>
                <br />
                <span style={{ color: "var(--color-primary)" }}>{titleLine2}</span>
              </>
            )}
          </h1>
          <p
            className="u-body-lg"
            style={{ color: "var(--color-on-surface-variant)", marginBottom: 40, maxWidth: 520 }}
          >
            {c.heroSubtitle}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 24 }}>
            <Link className="u-gradient-cta" href="#download">
              {c.heroCtaDownload}
            </Link>
            <Link className="u-outline-btn" href="#how-it-works">
              {c.heroCtaHowItWorks}
            </Link>
          </div>
          <p
            className="u-label-caps"
            style={{ color: "var(--color-on-surface-variant)", opacity: 0.7, fontStyle: "italic", margin: 0 }}
          >
            {c.disclaimerLine}
          </p>
        </div>

        {/* Image column */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid var(--color-outline-variant)",
            background: "var(--color-surface-container-high)",
          }}
        >
          <Image
            src="/hero-auto.jpg"
            alt="Automotive garage"
            fill
            style={{ objectFit: "cover", filter: "grayscale(20%)" }}
            sizes="(max-width: 900px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      <style>{`
        .hero-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 64px;
          align-items: center;
        }
        @media (min-width: 900px) {
          .hero-inner {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </section>
  );
}
