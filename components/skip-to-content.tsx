import type { Locale } from "@/lib/i18n";

const label: Record<Locale, string> = {
  hy: "Անցնել բովանդակությանը",
  en: "Skip to content",
  ru: "Перейти к содержимому",
};

interface SkipToContentProps {
  lang: Locale;
}

export function SkipToContent({ lang }: SkipToContentProps) {
  return (
    <a
      className="skip-to-content"
      href="#main-content"
      style={{
        position: "absolute",
        left: "var(--space-md)",
        top: "var(--space-md)",
        zIndex: 1000,
        padding: "var(--space-xs) var(--space-md)",
        background: "var(--color-surface-container-lowest)",
        borderRadius: "var(--radius-button)",
        fontWeight: 600,
        color: "var(--color-on-surface)",
        textDecoration: "none",
        transform: "translateY(-120%)",
        transition: "transform 0.15s ease",
      }}
    >
      {label[lang]}
    </a>
  );
}
