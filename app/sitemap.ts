import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site-url";

const PATHS = ["", "/privacy", "/terms", "/faq", "/trust"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    for (const path of PATHS) {
      entries.push({
        url: `${base}/${lang}${path}`,
        lastModified,
      });
    }
  }

  return entries;
}
