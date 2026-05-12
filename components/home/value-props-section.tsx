import type { MarketingContent } from "@/content/types";

const ICONS = ["location_on", "list_alt", "handshake"];

interface ValuePropsSectionProps {
  content: MarketingContent;
}

export function ValuePropsSection({ content: c }: ValuePropsSectionProps) {
  return (
    <section className="u-section u-page-padding u-section--tint">
      <div className="u-inner">
        <div className="value-props-grid">
          {c.features.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-outline-variant)",
                borderRadius: 8,
                padding: "40px",
                transition: "box-shadow 0.2s",
              }}
              className="value-card"
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 36,
                  color: "var(--color-primary)",
                  display: "block",
                  marginBottom: 24,
                }}
              >
                {ICONS[i]}
              </span>
              <h2 className="u-headline-md" style={{ marginBottom: 16, color: "var(--color-on-surface)" }}>
                {f.title}
              </h2>
              <p style={{ color: "var(--color-on-surface-variant)", margin: 0, lineHeight: 1.6 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .value-props-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .value-props-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .value-card:hover {
          box-shadow: var(--shadow-card-hover);
        }
      `}</style>
    </section>
  );
}
