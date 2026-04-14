import { contactEn } from "@/content/contact.en";
import { contactHy } from "@/content/contact.hy";
import { contactRu } from "@/content/contact.ru";
import { faqEn } from "@/content/faq.en";
import { faqHy } from "@/content/faq.hy";
import { faqRu } from "@/content/faq.ru";
import { marketingEn } from "@/content/marketing.en";
import { marketingHy } from "@/content/marketing.hy";
import { marketingRu } from "@/content/marketing.ru";
import { trustEn } from "@/content/trust.en";
import { trustHy } from "@/content/trust.hy";
import { trustRu } from "@/content/trust.ru";
import { privacyEn, privacyHy, privacyRu } from "@/content/legal/privacy";
import { termsEn, termsHy, termsRu } from "@/content/legal/terms";
import type { Locale } from "@/lib/i18n";
import type {
  ContactDocument,
  FaqDocument,
  LegalDocument,
  MarketingContent,
  TrustDocument,
} from "@/content/types";

export function getMarketing(locale: Locale): MarketingContent {
  if (locale === "en") return marketingEn;
  if (locale === "ru") return marketingRu;
  return marketingHy;
}

export function getPrivacy(locale: Locale): LegalDocument {
  if (locale === "en") return privacyEn;
  if (locale === "ru") return privacyRu;
  return privacyHy;
}

export function getTerms(locale: Locale): LegalDocument {
  if (locale === "en") return termsEn;
  if (locale === "ru") return termsRu;
  return termsHy;
}

export function getFaq(locale: Locale): FaqDocument {
  if (locale === "en") return faqEn;
  if (locale === "ru") return faqRu;
  return faqHy;
}

export function getTrust(locale: Locale): TrustDocument {
  if (locale === "en") return trustEn;
  if (locale === "ru") return trustRu;
  return trustHy;
}

export function getContact(locale: Locale): ContactDocument {
  if (locale === "en") return contactEn;
  if (locale === "ru") return contactRu;
  return contactHy;
}
