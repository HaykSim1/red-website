import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { DashboardView } from "./dashboard-view";

export default async function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <DashboardView lang={lang} />;
}
