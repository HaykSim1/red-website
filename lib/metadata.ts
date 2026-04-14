import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site-url";

interface PageMetaInput {
  lang: Locale;
  path: string;
  title: string;
  description: string;
}

function pathSuffix(path: string): string {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildPageMetadata({
  lang,
  path,
  title,
  description,
}: PageMetaInput): Metadata {
  const base = getSiteUrl();
  const suffix = pathSuffix(path);
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${base}/${l}${suffix}`;
  }
  const canonical = `${base}/${lang}${suffix}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      locale: lang,
      type: "website",
      url: canonical,
    },
  };
}
