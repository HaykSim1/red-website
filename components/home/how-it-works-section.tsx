import type { MarketingContent } from "@/content/types";

interface HowItWorksSectionProps {
  content: MarketingContent;
}

export function HowItWorksSection({ content: c }: HowItWorksSectionProps) {
  const { howItWorks } = c;

  return (
    <section id="how-it-works" className="u-section u-page-padding">
      <div className="u-inner">
        <div style={{ marginBottom: 64 }}>
          <h2 className="u-display-lg" style={{ marginBottom: 16, color: "var(--color-on-surface)" }}>
            {howItWorks.title}
          </h2>
          <div style={{ width: 96, height: 4, background: "var(--color-primary)", borderRadius: 2 }} />
        </div>

        <div className="hiw-grid">
          {howItWorks.steps.map((step, index) => (
            <div
              key={step.title}
              style={{
                position: "relative",
                padding: 24,
                borderLeft: "4px solid var(--color-primary)",
                background: "var(--color-surface)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  top: 12,
                  fontSize: 64,
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  opacity: 0.1,
                  lineHeight: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="u-headline-md" style={{ marginBottom: 8, color: "var(--color-on-surface)" }}>
                {step.title}
              </h3>
              <p style={{ color: "var(--color-on-surface-variant)", margin: 0, lineHeight: 1.6 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hiw-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        @media (min-width: 768px) {
          .hiw-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
