import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { apiBaseUrl, clearRefreshCookie, REFRESH_COOKIE, setRefreshCookie } from '@/lib/app/auth-cookie';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Spends the httpOnly refresh cookie for a new access token. The API rotates the
 * refresh token on every call, so the new one is written straight back to the
 * cookie; a failure clears it, which is what turns a dead session into a
 * redirect to the login screen on the client.
 */
export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ code: 'no_session', message: 'No refresh token' }, { status: 401 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${apiBaseUrl()}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {
    // Network blip: keep the cookie so a retry can still succeed.
    return NextResponse.json(
      { code: 'api_unreachable', message: 'Could not reach the API' },
      { status: 502 },
    );
  }

  const data = (await upstream.json().catch(() => null)) as
    | { access_token?: string; refresh_token?: string }
    | null;

  if (!upstream.ok || !data?.access_token || !data.refresh_token) {
    const res = NextResponse.json(
      { code: 'session_expired', message: 'Session expired' },
      { status: 401 },
    );
    clearRefreshCookie(res);
    return res;
  }

  const res = NextResponse.json({ access_token: data.access_token });
  setRefreshCookie(res, data.refresh_token);
  return res;
}
