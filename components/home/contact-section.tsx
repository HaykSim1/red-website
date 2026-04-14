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
  const telHref = s.phone.replace(/\s/g, "");

  return (
    <section id="contact" className="u-section u-page-padding u-section--tint">
      <div className="u-inner">
        <h2 className="u-screen-title" style={{ marginBottom: "var(--space-xl)" }}>
          {s.title}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "var(--space-xxl)",
            alignItems: "start",
          }}
        >
          <div>
            <p className="u-muted" style={{ marginBottom: "var(--space-lg)", maxWidth: 520 }}>
              {s.introLeft}
            </p>
            <ContactForm form={doc.form} locale={lang} />
          </div>
          <aside className="u-card" aria-labelledby="contact-info-heading">
            <h3 id="contact-info-heading" className="u-section-title" style={{ marginBottom: "var(--space-lg)" }}>
              {s.infoTitle}
            </h3>
            <dl style={{ margin: 0 }}>
              <div style={{ marginBottom: "var(--space-lg)" }}>
                <dt className="u-caption" style={{ marginBottom: "var(--space-xxs)" }}>
                  {s.phoneLabel}
                </dt>
                <dd className="u-body" style={{ margin: 0 }}>
                  <a href={`tel:${telHref}`} style={{ fontWeight: 600 }}>
                    {s.phone}
                  </a>
                </dd>
              </div>
              <div style={{ marginBottom: "var(--space-lg)" }}>
                <dt className="u-caption" style={{ marginBottom: "var(--space-xxs)" }}>
                  {s.emailLabel}
                </dt>
                <dd className="u-body" style={{ margin: 0 }}>
                  <a href={`mailto:${encodeURIComponent(supportEmail)}`} style={{ fontWeight: 600, wordBreak: "break-all" }}>
                    {supportEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="u-caption" style={{ marginBottom: "var(--space-xxs)" }}>
                  {s.addressLabel}
                </dt>
                <dd className="u-body" style={{ margin: 0, lineHeight: 1.5 }}>
                  {s.address}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
