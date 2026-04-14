import type { MarketingContent } from "@/content/types";

interface ValuePropsSectionProps {
  content: MarketingContent;
}

export function ValuePropsSection({ content: c }: ValuePropsSectionProps) {
  return (
    <section className="u-section u-page-padding">
      <div className="u-inner">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "var(--space-xl)",
          }}
        >
          {c.features.map((f) => (
            <div key={f.title} className="u-card">
              <h2 className="u-section-title" style={{ marginBottom: "var(--space-sm)" }}>
                {f.title}
              </h2>
              <p className="u-muted" style={{ margin: 0 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
