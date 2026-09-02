import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { SettingsView } from "./settings-view";

export default async function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <SettingsView lang={lang} />;
}
