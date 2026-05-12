import Image from "next/image";

import type { FaqDocument } from "@/content/types";

interface FaqPageContentProps {
  doc: FaqDocument;
}

export function FaqPageContent({ doc }: FaqPageContentProps) {
  return (
    <main style={{ paddingTop: 128, paddingBottom: "var(--section-gap)" }} className="u-page-padding">
      {/* Hero */}
      <header className="u-inner" style={{ marginBottom: 64 }}>
        <div style={{ maxWidth: 672, display: "flex", flexDirection: "column", gap: 16 }}>
          {doc.supportCenterLabel && (
            <span
              className="u-label-caps"
              style={{ color: "var(--color-primary)", letterSpacing: "0.1em" }}
            >
              {doc.supportCenterLabel}
            </span>
          )}
          <h1 className="u-display-lg" style={{ color: "var(--color-on-surface)" }}>
            {doc.pageTitle}
          </h1>
          {doc.pageSubtitle && (
            <p className="u-body-lg" style={{ color: "var(--color-on-surface-variant)", margin: 0 }}>
              {doc.pageSubtitle}
            </p>
          )}
        </div>
      </header>

      {/* Bento layout */}
      <div className="u-inner faq-layout">
        {/* Sidebar */}
        <aside className="faq-sidebar">
          <div
            style={{
              background: "var(--color-surface-container-low)",
              border: "1px solid var(--color-outline-variant)",
              borderRadius: 12,
              padding: 32,
              marginBottom: 24,
            }}
          >
            <h3 className="u-headline-md" style={{ marginBottom: 24, color: "var(--color-on-surface)" }}>
              Need more help?
            </h3>
            {doc.searchPlaceholder && (
              <div style={{ position: "relative", marginBottom: 24 }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-on-surface-variant)",
                    fontSize: 20,
                  }}
                >
                  search
                </span>
                <input
                  type="text"
                  placeholder={doc.searchPlaceholder}
                  style={{
                    width: "100%",
                    paddingLeft: 40,
                    paddingRight: 16,
                    paddingTop: 12,
                    paddingBottom: 12,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-outline)",
                    borderRadius: 8,
                    fontSize: 16,
                    outline: "none",
                    color: "var(--color-on-surface)",
                  }}
                />
              </div>
            )}
            {doc.categories && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {doc.categories.map((cat, i) => (
                  <button
                    key={cat.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px",
                      borderRadius: 4,
                      border: "none",
                      background: i === 0 ? "var(--color-surface-container-high)" : "transparent",
                      color: i === 0 ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                      fontWeight: i === 0 ? 700 : 400,
                      cursor: "pointer",
                      fontSize: 16,
                      textAlign: "left",
                      transition: "background 0.15s",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car image accent */}
          <div
            style={{
              position: "relative",
              height: 256,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Image
              src="/faq-car.jpg"
              alt="Luxury car"
              fill
              style={{ objectFit: "cover", filter: "grayscale(100%)", transition: "filter 0.7s" }}
              sizes="400px"
              className="faq-car-img"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                display: "flex",
                alignItems: "flex-end",
                padding: 24,
              }}
            >
              <p
                className="u-label-caps"
                style={{ color: "white" }}
              >
                Precision in every request.
              </p>
            </div>
          </div>
        </aside>

        {/* Accordion area */}
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {doc.items.map((item) => (
            <div
              key={item.question}
              className="accordion-item"
              tabIndex={0}
            >
              <div className="accordion-header">
                <h4 className="u-headline-md" style={{ color: "var(--color-on-surface)", margin: 0 }}>
                  {item.question}
                </h4>
                <span className="material-symbols-outlined accordion-arrow" style={{ fontSize: 24 }}>
                  expand_more
                </span>
              </div>
              <div className="accordion-content">
                <div
                  style={{
                    paddingTop: 24,
                    fontSize: 16,
                    color: "var(--color-on-surface-variant)",
                    lineHeight: 1.6,
                    borderTop: "1px solid var(--color-outline-variant)",
                  }}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          ))}

          {/* CTA block */}
          {doc.stillHaveQuestionsTitle && (
            <div
              style={{
                marginTop: 32,
                background: "var(--color-primary)",
                borderRadius: 12,
                padding: 32,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
              }}
            >
              <div>
                <h5
                  className="u-headline-md"
                  style={{ color: "white", marginBottom: 4 }}
                >
                  {doc.stillHaveQuestionsTitle}
                </h5>
                {doc.stillHaveQuestionsBody && (
                  <p style={{ color: "#ffdad6", margin: 0 }}>
                    {doc.stillHaveQuestionsBody}
                  </p>
                )}
              </div>
              <a
                href="#contact"
                style={{
                  background: "white",
                  color: "var(--color-primary)",
                  padding: "12px 32px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  transition: "background 0.15s",
                }}
              >
                {doc.contactSupportCta}
              </a>
            </div>
          )}
        </section>
      </div>

      <style>{`
        .faq-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 1024px) {
          .faq-layout {
            grid-template-columns: 4fr 8fr;
          }
        }
        .faq-sidebar {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .faq-car-img:hover {
          filter: grayscale(0%) !important;
        }
      `}</style>
    </main>
  );
}
