import { NextResponse } from "next/server";

import { getContact } from "@/content";
import { mapContactZodErrors } from "@/lib/contact-form-errors";
import { contactFormSchema } from "@/lib/contact-schema";
import { isLocale } from "@/lib/i18n";
import { sendContactFormEmail } from "@/lib/mail";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 8;
const hits = new Map<string, number[]>();

function rateLimitKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const list = hits.get(key) ?? [];
  const recent = list.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const rawLocale =
    typeof body === "object" && body !== null && "locale" in body
      ? String((body as { locale?: unknown }).locale)
      : "en";
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const formCopy = getContact(locale).form;

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors = mapContactZodErrors(parsed.error, formCopy);
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const { name, phone, email, message, website } = parsed.data;
  if (website?.trim()) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const key = rateLimitKey(request);
  if (isRateLimited(key)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", message: formCopy.rateLimited },
      { status: 429 },
    );
  }

  try {
    await sendContactFormEmail({ name, phone, email, message });
  } catch (e) {
    const msg = e instanceof Error && e.message === "SMTP_NOT_CONFIGURED" ? "smtp_missing" : "send_failed";
    if (msg === "smtp_missing") {
      return NextResponse.json(
        { ok: false, error: "smtp_missing", message: formCopy.errorNotConfigured },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "send_failed", message: formCopy.errorGeneric },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
