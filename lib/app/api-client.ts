import { API_PREFIX } from './constants';
import { getApiBaseUrl } from './api-base';
import {
  getAccessToken,
  notifySessionExpired,
  setAccessToken,
} from './auth-store';

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function parseError(res: Response): Promise<ApiErrorBody> {
  try {
    const j = (await res.json()) as ApiErrorBody;
    if (j && typeof j.code === 'string') return j;
  } catch {
    /* ignore */
  }
  return {
    code: 'http_error',
    message: res.statusText || 'Request failed',
  };
}

export type ApiFetchOptions = RequestInit & {
  skipAuth?: boolean;
};

// Deduplicates concurrent 401 retries — only one refresh call in flight at a time.
let refreshPromise: Promise<boolean> | null = null;

/**
 * Ask our own route handler to spend the httpOnly refresh cookie. The API's
 * rotating refresh token never touches client JS: the handler reads the cookie,
 * calls POST /v1/auth/refresh server-side, writes the rotated cookie back and
 * returns only the short-lived access token.
 */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'same-origin',
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { access_token?: string };
    if (!data.access_token) return false;
    setAccessToken(data.access_token);
    return true;
  } catch {
    return false;
  }
}

function attemptSilentRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function buildUrl(path: string): string {
  return `${getApiBaseUrl()}${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
}

function fetchWithAuth(path: string, init: ApiFetchOptions): Promise<Response> {
  const url = buildUrl(path);
  const headers: Record<string, string> = {
    ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(init.headers as Record<string, string> | undefined),
  };
  if (!init.skipAuth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, { ...init, headers });
}

export async function apiFetch(path: string, init: ApiFetchOptions = {}): Promise<Response> {
  const res = await fetchWithAuth(path, init);

  if (res.status === 401 && !init.skipAuth) {
    const refreshed = await attemptSilentRefresh();

    if (refreshed) {
      const retryRes = await fetchWithAuth(path, init);
      if (!retryRes.ok) {
        throw new ApiError(retryRes.status, await parseError(retryRes));
      }
      return retryRes;
    }

    setAccessToken(null);
    notifySessionExpired();
    throw new ApiError(res.status, await parseError(res));
  }

  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res));
  }

  return res;
}

export async function apiJson<T>(path: string, init?: ApiFetchOptions): Promise<T> {
  const res = await apiFetch(path, init);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
