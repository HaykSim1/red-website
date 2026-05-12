import type { Locale } from "@/lib/i18n";

export interface ScreenshotItem {
  src: string;
  title: string;
  alt: string;
}

export interface MarketingContent {
  metaTitle: string;
  metaDescription: string;
  nav: {
    home: string;
    privacy: string;
    terms: string;
    faq: string;
    trust: string;
    howItWorks: string;
    forBuyers: string;
    forSellers: string;
    contactUs: string;
  };
  /** Short labels for the language switcher */
  langSwitcher: Record<Locale, string>;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaHowItWorks: string;
  heroCtaDownload: string;
  features: { title: string; body: string }[];
  howItWorks: {
    title: string;
    steps: { title: string; body: string }[];
  };
  audiences: {
    title: string;
    buyersTitle: string;
    buyersSubtitle: string;
    buyersBullets: string[];
    sellersTitle: string;
    sellersSubtitle: string;
    sellersBullets: string[];
  };
  homeFaqTeaser: {
    title: string;
    body: string;
    cta: string;
  };
  disclaimerLine: string;
  screenshotsSectionTitle: string;
  screenshotsEmpty: string;
  screenshots: ScreenshotItem[];
  downloadSectionTitle: string;
  downloadAppStore: string;
  downloadGooglePlay: string;
  /** Alt text for App Store badge image */
  downloadAppStoreBadgeAlt: string;
  /** Alt text for Google Play badge image */
  downloadGooglePlayBadgeAlt: string;
  downloadSoon: string;
  footerTagline: string;
  footerRights: string;
  footerFollowUs: string;
  footerResourcesLabel: string;
  footerHelpLabel: string;
  /** Home page contact block (left: form, right: info) */
  contactSection: {
    title: string;
    introLeft: string;
    infoTitle: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
    phone: string;
    address: string;
    supportTitle: string;
    businessTitle: string;
    businessSubtitle: string;
    businessEmail: string;
    officeHoursTitle: string;
    officeHoursMF: string;
    officeHoursSat: string;
  };
}

export interface LegalDocument {
  metaTitle: string;
  metaDescription: string;
  pageTitle: string;
  /** ISO date YYYY-MM-DD for display only */
  lastUpdated?: string;
  sections: { heading: string; paragraphs: string[] }[];
}

export interface FaqDocument {
  metaTitle: string;
  metaDescription: string;
  pageTitle: string;
  pageSubtitle?: string;
  supportCenterLabel?: string;
  searchPlaceholder?: string;
  categories?: { icon: string; label: string }[];
  stillHaveQuestionsTitle?: string;
  stillHaveQuestionsBody?: string;
  contactSupportCta?: string;
  items: { question: string; answer: string }[];
}

export interface TrustDocument {
  metaTitle: string;
  metaDescription: string;
  pageTitle: string;
  sections: { heading: string; paragraphs: string[] }[];
}

export interface ContactDocument {
  metaTitle: string;
  metaDescription: string;
  pageTitle: string;
  intro: string;
  emailLabel: string;
  form: {
    sectionTitle: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    messageLabel: string;
    submit: string;
    sending: string;
    success: string;
    errorGeneric: string;
    errorNotConfigured: string;
    rateLimited: string;
    val: {
      nameMin: string;
      nameMax: string;
      phoneMin: string;
      phoneMax: string;
      phoneInvalid: string;
      emailInvalid: string;
      emailMax: string;
      messageMin: string;
      messageMax: string;
      localeInvalid: string;
    };
  };
}
