import type { FaqDocument } from "@/content/types";

interface FaqPageContentProps {
  doc: FaqDocument;
}

export function FaqPageContent({ doc }: FaqPageContentProps) {
  return (
    <article className="u-inner u-page-padding" style={{ paddingBottom: "var(--space-xxl)" }}>
      <h1 className="u-display" style={{ marginBottom: "var(--space-xl)" }}>
        {doc.pageTitle}
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        {doc.items.map((item) => (
          <details
            key={item.question}
            className="u-card"
            style={{ padding: "var(--space-md) var(--space-lg)", cursor: "pointer" }}
          >
            <summary className="u-section-title" style={{ listStyle: "none" }}>
              {item.question}
            </summary>
            <p className="u-muted" style={{ marginTop: "var(--space-md)", marginBottom: 0 }}>
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </article>
  );
}
