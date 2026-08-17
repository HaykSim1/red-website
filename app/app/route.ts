import { NextResponse } from "next/server";

import { defaultLocale } from "@/lib/i18n";

/**
 * Short download link: https://red-auto.store/app
 *
 * Routes the visitor to the right store by user agent. Desktop, bots, and
 * anything unrecognised land on the marketing page, which already shows both
 * store badges. Meant for Instagram bios, SMS, QR codes — the site itself
 * links to the stores directly.
 */

const IOS_PATTERN = /iPhone|iPad|iPod/i;
const ANDROID_PATTERN = /Android/i;

function storeUrl(pattern: RegExp, userAgent: string, value: string | undefined) {
  if (!pattern.test(userAgent)) return null;
  const url = value?.trim();
  return url ? url : null;
}

export async function GET(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";

  const target =
    storeUrl(IOS_PATTERN, userAgent, process.env.NEXT_PUBLIC_APP_STORE_URL) ??
    storeUrl(ANDROID_PATTERN, userAgent, process.env.NEXT_PUBLIC_PLAY_STORE_URL) ??
    new URL(`/${defaultLocale}`, request.url).toString();

  // 307 + no-store: the destination varies per device, so nothing along the
  // way may cache one visitor's redirect and replay it for another.
  return NextResponse.redirect(target, {
    status: 307,
    headers: { "Cache-Control": "no-store" },
  });
}
