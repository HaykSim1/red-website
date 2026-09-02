import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n";

import { ProfileView } from "./profile-view";

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <ProfileView lang={lang} />;
}
