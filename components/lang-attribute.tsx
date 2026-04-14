"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { defaultLocale, isLocale } from "@/lib/i18n";

export function LangAttribute() {
  const pathname = usePathname();
  useEffect(() => {
    const segment = pathname.split("/").filter(Boolean)[0];
    const lang = segment && isLocale(segment) ? segment : defaultLocale;
    document.documentElement.lang = lang;
  }, [pathname]);
  return null;
}
