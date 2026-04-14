import type { MarketingContent } from "@/content/types";

interface AudiencesSectionProps {
  content: MarketingContent;
}

export function AudiencesSection({ content: c }: AudiencesSectionProps) {
  const { audiences } = c;

  return (
    <section id="audiences" className="u-section u-page-padding">
      <div className="u-inner">
        <h2 className="u-screen-title" style={{ marginBottom: "var(--space-xl)" }}>
          {audiences.title}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-xl)",
          }}
        >
          <div className="u-card">
            <h3 className="u-section-title" style={{ marginBottom: "var(--space-md)" }}>
              {audiences.buyersTitle}
            </h3>
            <ul style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
              {audiences.buyersBullets.map((line) => (
                <li key={line} className="u-muted" style={{ marginBottom: "var(--space-sm)" }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="u-card">
            <h3 className="u-section-title" style={{ marginBottom: "var(--space-md)" }}>
              {audiences.sellersTitle}
            </h3>
            <ul style={{ margin: 0, paddingLeft: "var(--space-lg)" }}>
              {audiences.sellersBullets.map((line) => (
                <li key={line} className="u-muted" style={{ marginBottom: "var(--space-sm)" }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
