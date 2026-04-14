import type { Locale } from "@/lib/i18n";

const lastUpdatedPrefix: Record<Locale, string> = {
  hy: "Թարմացվել է՝",
  en: "Last updated:",
  ru: "Обновлено:",
};

export interface SectionsDocument {
  pageTitle: string;
  sections: { heading: string; paragraphs: string[] }[];
  lastUpdated?: string;
}

interface LegalDocumentViewProps {
  document: SectionsDocument;
  lang: Locale;
}

export function LegalDocumentView({ document, lang }: LegalDocumentViewProps) {
  const { pageTitle, sections, lastUpdated } = document;

  return (
    <article className="u-inner u-page-padding" style={{ paddingBottom: "var(--space-xxl)" }}>
      <h1 className="u-display" style={{ marginBottom: "var(--space-md)" }}>
        {pageTitle}
      </h1>
      {lastUpdated ? (
        <p className="u-caption" style={{ marginBottom: "var(--space-xl)" }}>
          {lastUpdatedPrefix[lang]} {lastUpdated}
        </p>
      ) : null}
      {sections.map((section) => (
        <section key={section.heading} style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 className="u-section-title" style={{ marginBottom: "var(--space-md)" }}>
            {section.heading}
          </h2>
          {section.paragraphs.map((p, index) => (
            <p key={`${section.heading}-${index}`} className="u-body" style={{ marginBottom: "var(--space-md)" }}>
              {p}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
