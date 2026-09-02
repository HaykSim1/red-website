import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { NewRequestForm } from "./new-request-form";

export default async function NewRequestPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <NewRequestForm lang={lang} />;
}
