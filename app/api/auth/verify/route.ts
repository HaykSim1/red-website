import { NextResponse } from 'next/server';
import { z } from 'zod';

import { apiBaseUrl, setRefreshCookie } from '@/lib/app/auth-cookie';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Same shape the mobile login screen posts — see api/src/auth/dto/otp-verify.dto.ts. */
const bodySchema = z.object({
  phone: z.string().min(1).max(32),
  code: z.string().min(1).max(8),
});

/**
 * Exchanges an OTP for a session. The API's response carries both tokens; the
 * refresh token is stashed in an httpOnly cookie here and never forwarded to the
 * browser, so only the short-lived access token reaches client JavaScript.
 */
export async function POST(request: Request) {
  let parsed: z.infer<typeof bodySchema>;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ code: 'bad_request', message: 'Invalid body' }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${apiBaseUrl()}/v1/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    });
  } catch {
    return NextResponse.json(
      { code: 'api_unreachable', message: 'Could not reach the API' },
      { status: 502 },
    );
  }

  const data = (await upstream.json().catch(() => null)) as
    | { access_token?: string; refresh_token?: string; user?: unknown; code?: string; message?: string }
    | null;

  if (!upstream.ok || !data?.access_token || !data.refresh_token) {
    return NextResponse.json(
      data ?? { code: 'http_error', message: 'Verification failed' },
      { status: upstream.ok ? 502 : upstream.status },
    );
  }

  const res = NextResponse.json({ access_token: data.access_token, user: data.user });
  setRefreshCookie(res, data.refresh_token);
  return res;
}
