import type { MarketingContent } from "@/content/types";

interface HowItWorksSectionProps {
  content: MarketingContent;
}

export function HowItWorksSection({ content: c }: HowItWorksSectionProps) {
  const { howItWorks } = c;

  return (
    <section id="how-it-works" className="u-section u-page-padding u-section--tint">
      <div className="u-inner">
        <h2 className="u-screen-title" style={{ marginBottom: "var(--space-xl)" }}>
          {howItWorks.title}
        </h2>
        <ol
          style={{
            margin: 0,
            paddingLeft: "var(--space-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-xl)",
            maxWidth: 720,
          }}
        >
          {howItWorks.steps.map((step, index) => (
            <li key={step.title} className="u-body" style={{ paddingLeft: "var(--space-xs)" }}>
              <span className="u-section-title" style={{ display: "block", marginBottom: "var(--space-xs)" }}>
                {index + 1}. {step.title}
              </span>
              <span className="u-muted">{step.body}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
