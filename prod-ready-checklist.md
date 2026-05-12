# Production readiness checklist (Red Auto platform)

This checklist covers the full Red Auto stack in this workspace:

- `website/` — Next.js marketing site (hy/en/ru) + `POST /api/contact`
- `api/` — NestJS + PostgreSQL backend (HTTP + realtime + push + OTP/SMS) per `docs/`
- `mobile/` — Expo (React Native) iOS/Android app
- `admin/` — Admin web app (TypeScript SPA) calling `/v1/admin/*`

Docs in `docs/` are the product/technical contract.

## Cross-cutting (all apps/services)

- **Versioning + environments**
  - Define environments: **dev**, **staging**, **production**.
  - Ensure production uses production-grade providers (SMS, SMTP, storage) and production-only flags are enforced.
- **Secrets management**
  - Never commit `.env` files with secrets.
  - Use per-environment secret stores (hosting provider secrets, GitHub Actions secrets, EAS secrets).
- **CI/CD baseline**
  - On every push/PR: install → lint → typecheck (if present) → build.
  - Add deploy previews for web apps (website/admin) and a staging deploy for API.
- **Contract sync (API ↔ mobile/admin)**
  - Keep HTTP contracts aligned with `docs/api.md` + `docs/database.md`.
  - Adopt OpenAPI sync strategy (per `docs/project-structure.md`): generate types in mobile/admin after API changes and commit generated artifacts (or publish a shared package).
- **Observability**
  - Centralize logs per service; avoid logging raw phone/VIN (use ids where possible).
  - Add error reporting (e.g. Sentry) to API and web apps; add crash reporting to mobile.
  - Uptime checks for API + critical pages.

## Website (`website/`) — Next.js marketing site

### Build + deploy

- **Choose hosting mode**
  - **Dynamic Next server** (recommended if you need `/api/contact`): deploy as a standard Next.js app.
  - **Static export** (only if you *don’t* need `/api/contact`): enable `output: "export"` in `next.config.ts` and host the generated `out/` directory (then replace contact sending with an external form/API).
- **Lock Node version**
  - Ensure build environment uses **Node.js 20+** (matches `README.md`).
- **Build must be clean**
  - `npm run lint`
  - `npm run build`

### Environment variables

- **Set env vars in hosting provider**
  - **Public**:
    - `NEXT_PUBLIC_SITE_URL` (canonical origin; sitemap; **no trailing slash**)
    - `NEXT_PUBLIC_APP_STORE_URL`
    - `NEXT_PUBLIC_PLAY_STORE_URL`
    - `NEXT_PUBLIC_SUPPORT_EMAIL`
    - `NEXT_PUBLIC_SOCIAL_INSTAGRAM`
    - `NEXT_PUBLIC_SOCIAL_FACEBOOK`
    - `NEXT_PUBLIC_SOCIAL_TIKTOK`
  - **Server-only**:
    - `CONTACT_TO`
    - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- **Runtime behavior check**
  - Without SMTP, `POST /api/contact` returns `503` `smtp_missing` (expected). Ensure SMTP is configured before public launch.

### Contact form + email deliverability

- **Use a real SMTP provider**
  - Avoid fragile setups (personal inbox SMTP) unless you accept rate limits/deliverability issues.
- **Configure domain authentication**
  - Set **SPF**, **DKIM**, and **DMARC** for the domain used by `SMTP_FROM` to reduce spam/junk placement.
- **Rate limiting expectations**
  - The current rate limit is **in-memory** and keyed by `x-forwarded-for`. On serverless/multi-instance deployments it is **best-effort** (resets per instance / cold start).
  - If you need strict limits, move to a shared store (Redis/Upstash) or provider/WAF rate limiting.
- **Bot protection**
  - Honeypot exists (`website` field). If spam appears, add provider WAF rules or a challenge (e.g., Cloudflare Turnstile).

### Security + SEO + performance

- **Security headers**
  - Consider: **HSTS**, **CSP**, **X-Content-Type-Options**, **Referrer-Policy**, **Permissions-Policy** (exact policy depends on your asset needs).
- **SEO**
  - Validate `NEXT_PUBLIC_SITE_URL` is correct; wrong canonical/sitemap origins hurt SEO.
  - Confirm `sitemap.xml` and `robots.txt` output matches the live domain and intended indexing behavior.
  - Check Open Graph/Twitter previews for key pages in each locale.
  - Confirm intended behavior: `/` redirects to `/hy` (per `README.md`).
- **Performance**
  - Use correct dimensions and compressed assets (prefer WebP where applicable) especially for screenshots and LCP elements.
  - After launch, track LCP/CLS/INP and fix regressions early.

## API server (`api/`) — NestJS + PostgreSQL

### Data + migrations

- **Postgres**
  - Ensure backups + PITR (or daily backups at minimum) are configured.
  - Ensure DB connections are pooled appropriately for your host.
- **Migrations**
  - `synchronize` must be **off**; use versioned migrations only (per `docs/decisions.md` D-010).
  - Run migrations automatically during deploy (or as an explicit release step) with safe ordering.

### Environment + auth

- **JWT**
  - Strong `JWT_SECRET` in production; rotate plan documented.
- **OTP/SMS provider**
  - `SMS_PROVIDER` must be production-grade (not `dev`) unless explicitly allowed for staging.
  - Production must reject `OTP_DEV_MODE` per `docs/architecture.md` / `docs/decisions.md`.
- **Admin bootstrap safety**
  - Ensure seeding / admin bootstrap flags are disabled in real production unless explicitly intended (see `docs/decisions.md` D-016).

### Storage + uploads

- **Object storage**
  - Use S3-compatible storage with presigned uploads; never ship bucket credentials to clients.
  - Validate content type/size; implement malware scanning if required later.

### Realtime + push

- **WebSocket/SSE**
  - Authenticate realtime connections with JWT; ensure reconnect + token refresh strategy is defined on clients.
- **Push notifications**
  - Store multiple device tokens per user; handle invalid token cleanup.
  - Consider an outbox/queue so push failures don’t break DB transactions.

### Security + abuse prevention

- **Rate limits**
  - Rate limit OTP requests (by phone and IP).
  - Apply request-level limits to public endpoints.
- **Logging hygiene**
  - Avoid logging raw phone/VIN; prefer ids (per `docs/architecture.md`).

### Observability + ops

- **Health checks**
  - Expose `/health` (or equivalent) and monitor it.
- **Structured logging**
  - Include request ids, user ids (not phone), route, latency, status.
- **Error reporting**
  - Capture unhandled exceptions with stack traces + environment tags.

## Mobile app (`mobile/`) — Expo (iOS/Android)

### Builds + release (EAS)

- **EAS project + build profiles**
  - Configure **development**, **preview**, and **production** build profiles.
- **Credentials**
  - Store signing credentials in EAS; avoid committing keys/certs.
- **Push notifications**
  - Configure APNs + FCM correctly for production builds.
  - Ensure you test notifications on an **EAS build** (Expo Go can show Expo branding and differs from standalone behavior).
- **OTA updates**
  - Decide if OTA updates are enabled; if yes, define channel strategy (staging vs production) and a rollback process.

### App config + runtime safety

- **Environment variables**
  - Use `EXPO_PUBLIC_*` only for non-secret values (e.g. API base URL).
  - Secrets must be injected via EAS/build-time secrets (not bundled into JS).
- **Crash reporting**
  - Add crash/error reporting (native + JS) for production builds.

### Performance + UX

- **Perf budget**
  - Profile slow screens; avoid unnecessary re-renders; optimize lists and images.
- **Offline + retries**
  - Define behavior for network loss (queue/retry critical actions where appropriate).

### Store readiness

- **App Store / Play Store**
  - Verify app metadata, screenshots, privacy disclosures, and that policy URLs point to the live website.
  - Confirm support email, contact URL, and locale expectations.

## Admin web (`admin/`) — TypeScript SPA

### Auth + security

- **Admin auth**
  - Uses admin JWT and calls `/v1/admin/*` only; ensure admin-only guards are enforced server-side.
  - Store tokens safely (at minimum `sessionStorage` per `docs/decisions.md` D-016).
- **CORS**
  - Restrict CORS to the admin origin(s) only.

### Deployment

- **Build**
  - Lint/typecheck/build in CI.
- **Env**
  - Configure `VITE_API_URL` (or equivalent) per environment.

## Legal + customer support (website + apps)

- **Policy URLs**
  - Ensure Privacy/Terms are live and correct per locale.
- **Support channels**
  - Confirm support email/phone and response workflow is in place.

