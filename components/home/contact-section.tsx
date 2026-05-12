import { ContactForm } from "@/components/contact-form";
import { getContact } from "@/content";
import type { MarketingContent } from "@/content/types";
import type { Locale } from "@/lib/i18n";

interface ContactSectionProps {
  lang: Locale;
  content: MarketingContent;
  supportEmail: string;
}

export function ContactSection({ lang, content, supportEmail }: ContactSectionProps) {
  const s = content.contactSection;
  const doc = getContact(lang);

  return (
    <section id="contact" className="u-section u-page-padding u-section--tint" style={{ borderTop: "1px solid var(--color-outline-variant)" }}>
      <div className="u-inner">
        <div className="contact-grid">
          {/* Form side */}
          <div>
            <h2 className="u-display-lg" style={{ marginBottom: 32, color: "var(--color-on-surface)" }}>
              {s.title}
            </h2>
            <ContactForm form={doc.form} locale={lang} />
          </div>

          {/* Info side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {/* Support Hub */}
            <div>
              <p
                className="u-label-caps"
                style={{ color: "var(--color-primary)", marginBottom: 16 }}
              >
                {s.supportTitle}
              </p>
              <p style={{ color: "var(--color-on-surface-variant)", marginBottom: 8 }}>
                {s.address}
              </p>
              <a
                href={`tel:${s.phone.replace(/\s/g, "")}`}
                className="u-headline-md"
                style={{ fontWeight: 700, color: "var(--color-on-surface)", textDecoration: "none" }}
              >
                {s.phone}
              </a>
            </div>

            {/* Business Inquiries */}
            <div>
              <p
                className="u-label-caps"
                style={{ color: "var(--color-primary)", marginBottom: 16 }}
              >
                {s.businessTitle}
              </p>
              <p style={{ color: "var(--color-on-surface-variant)", marginBottom: 8 }}>
                {s.businessSubtitle}
              </p>
              <a
                href={`mailto:${s.businessEmail}`}
                className="u-headline-md"
                style={{ fontWeight: 700, color: "var(--color-on-surface)", textDecoration: "none" }}
              >
                {s.businessEmail}
              </a>
            </div>

            {/* Office Hours card */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-outline-variant)",
                borderRadius: 8,
                padding: 24,
              }}
            >
              <h4 className="u-headline-md" style={{ marginBottom: 8, color: "var(--color-on-surface)" }}>
                {s.officeHoursTitle}
              </h4>
              <p style={{ color: "var(--color-on-surface-variant)", marginBottom: 4 }}>
                {s.officeHoursMF}
              </p>
              <p style={{ color: "var(--color-on-surface-variant)", margin: 0 }}>
                {s.officeHoursSat}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
            gap: 96px;
          }
        }
      `}</style>
    </section>
  );
}
