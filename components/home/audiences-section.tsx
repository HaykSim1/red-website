import type { MarketingContent } from "@/content/types";

interface AudiencesSectionProps {
  content: MarketingContent;
}

export function AudiencesSection({ content: c }: AudiencesSectionProps) {
  const { audiences } = c;

  return (
    <section id="audiences" className="u-section u-page-padding u-section--dark">
      <div className="u-inner">
        <div className="audiences-grid">
          {/* Buyers */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <h2 className="u-display-lg" style={{ color: "var(--color-surface)" }}>
              {audiences.buyersTitle}
            </h2>
            <p className="u-body-lg" style={{ color: "#c9c6c5", margin: 0 }}>
              {audiences.buyersSubtitle}
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
              {audiences.buyersBullets.map((line) => (
                <li
                  key={line}
                  style={{ display: "flex", alignItems: "center", gap: 12, color: "#e4e2e1" }}
                >
                  <span className="material-symbols-outlined" style={{ color: "var(--color-primary-gradient-end)", flexShrink: 0 }}>
                    check_circle
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {/* Sellers */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <h2 className="u-display-lg" style={{ color: "var(--color-surface)" }}>
              {audiences.sellersTitle}
            </h2>
            <p className="u-body-lg" style={{ color: "#c9c6c5", margin: 0 }}>
              {audiences.sellersSubtitle}
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
              {audiences.sellersBullets.map((line) => (
                <li
                  key={line}
                  style={{ display: "flex", alignItems: "center", gap: 12, color: "#e4e2e1" }}
                >
                  <span className="material-symbols-outlined" style={{ color: "var(--color-primary-gradient-end)", flexShrink: 0 }}>
                    check_circle
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .audiences-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 768px) {
          .audiences-grid {
            grid-template-columns: 1fr 1fr;
            gap: 96px;
          }
        }
      `}</style>
    </section>
  );
}
