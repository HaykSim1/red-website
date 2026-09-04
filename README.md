# Red Auto website

This workspace ships **two things** from one Next.js app and one deploy:

1. **Marketing site** (hy / en / ru) — landing (hero, value props, how it works,
   buyers/sellers, FAQ teaser, screenshots, **contact form + info** two-column block),
   **FAQ**, **Trust & safety**, **Privacy**, **Terms**, store badges, footer social
   links, `sitemap.xml`, `robots.txt`. Pages live under `app/[lang]/(marketing)/`.
2. **Web app** at `/[lang]/app/*` — the authenticated product for buyers and sellers,
   reached from the header's **Log in**. Everything the Expo app does. Routes, session
   design and the deliberate divergences from the Stitch mockups are in
   [`../docs/web-app.md`](../docs/web-app.md).

Two rules that are easy to break:

- **`app/globals.css` must NOT be imported by the root layout.** It is imported by the
  `(marketing)` layout and `not-found.tsx`. Its un-layered rules outrank every Tailwind
  utility regardless of file order; loading it site-wide repaints the app's red CTAs as
  blue links.
- **Tailwind v4 is scoped to the app subtree** via `app/[lang]/app/app.css`, imported only
  by the app and login layouts. Marketing keeps its hand-written CSS and loads no Tailwind.

## Requirements

- Node.js 20+ recommended
- npm

## Setup

```bash
cd website
npm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata (hreflang / Open Graph) and `sitemap.xml`. Example: `https://www.redauto.am` |
| `NEXT_PUBLIC_APP_STORE_URL` | Apple App Store listing URL (wraps the App Store badge) |
| `NEXT_PUBLIC_PLAY_STORE_URL` | Google Play listing URL (wraps the Google Play badge) |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Shown on the Contact page and used for the `mailto:` link |
| `NEXT_PUBLIC_SOCIAL_INSTAGRAM` | Full profile URL (Instagram icon in footer) |
| `NEXT_PUBLIC_SOCIAL_FACEBOOK` | Full page/profile URL (Facebook icon in footer) |
| `NEXT_PUBLIC_SOCIAL_TIKTOK` | Full profile URL (TikTok icon in footer) |
| `CONTACT_TO` | Inbox for **contact form** submissions (default `info@red-auto.store`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Required for `POST /api/contact` to send email via Nodemailer. Use port `465` and `SMTP_SECURE=true` if your provider requires SSL. |
| `SMTP_SECURE` | Optional. Set to `true` for implicit TLS (e.g. port 465). |
| `NEXT_PUBLIC_API_URL` | **Web app.** Red Auto API origin — no trailing slash, no `/v1`. Inlined at **build** time, so it must be set when the app is compiled, not only at runtime. The site origin must also appear in the API's `CORS_ORIGINS`. |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | Optional CDN base for uploaded media; otherwise taken from `GET /v1/client-config`. |
| `API_INTERNAL_URL` | Optional, **leave unset** unless the Next server reaches the API over a private network. Used only by the server-side `/api/auth/*` handlers — pointing it somewhere unresolvable breaks OTP *verification* while OTP *delivery* keeps working, because the browser and the server take different paths. |

If store URLs are empty, the download section shows a localized “coming soon” message and **no** badge links. If social URLs are empty, the matching icon is hidden.

### Contact form

The home page contact form posts to **`/api/contact`** (Next.js Route Handler). Submissions are validated with **Zod** on the server and sent with **Nodemailer** to **`CONTACT_TO`** (defaults to **info@red-auto.store**). Without SMTP env vars, the API returns **503** and the UI shows a localized “not configured” message.

Client-side validation mirrors the server schema (name, phone, email, message, locale). A hidden honeypot field drops bot submissions silently.

## Store badges

Official artwork is committed under `public/badges/`:

- `app-store.svg` — from [Apple Marketing Resources](https://www.apple.com/app-store/marketing/guidelines/)
- `google-play.png` — from [Google Play badge guidelines](https://play.google.com/intl/en_us/badges/)

Replace these files when Apple/Google update brand assets.

## Scripts

```bash
npm run dev          # local dev server (http://localhost:3000 → redirects to /hy)
npm run build        # production build
npm run start        # run production server locally
npm run lint
npm run openapi:gen  # regenerate lib/app/api-generated.d.ts (needs the API running on :3000)
```

## Routes

| Path | Content |
|------|---------|
| `/` | Redirects to `/hy` |
| `/hy`, `/en`, `/ru` | Landing |
| `/[lang]/faq` | FAQ |
| `/[lang]/trust` | Trust & safety |
| `/[lang]/privacy` | Privacy policy |
| `/[lang]/terms` | Terms of use |
| `/app` | **Store redirect.** 307 by User-Agent: iOS → App Store, Android → Google Play, everything else → `/hy`. For QR codes, SMS and Instagram bios; nothing on the site links to it. Unrelated to `/[lang]/app` below. |
| `/[lang]/login` | Phone + OTP sign-in |
| `/[lang]/app` | Web app — dashboard |
| `/[lang]/app/requests`, `/requests/new`, `/requests/[id]` | Buyer: requests and the deal flow |
| `/[lang]/app/market`, `/market/[id]`, `/market/[id]/offer` | Seller-only: open requests and offers |
| `/[lang]/app/history`, `/vehicles`, `/shops/[id]`, `/profile`, `/settings` | Shared |
| `/api/contact` | Contact form handler (SMTP) |
| `/api/auth/{verify,refresh,logout}` | Session handlers; the only server-side calls to the API |

## Screenshots

Place PNG/WebP files under `public/screenshots/`. Filenames referenced in content:

- `public/screenshots/home.png`
- `public/screenshots/requests.png`
- `public/screenshots/market.png`

The repo may use the app **logo** as a placeholder until you add real device captures.

## Logo

`public/logo.png` is copied from the Expo app (`mobile/assets/images/logo.png`). Re-copy after logo updates:

```bash
cp ../mobile/assets/images/logo.png public/logo.png
```

## Accessibility

- Skip link (keyboard): first focusable control in `[lang]` layout jumps to `#main-content`.
- Prefer real screenshot dimensions and compressed WebP for LCP.

## Static export — no longer possible

> ⚠️ This workspace **cannot** use `output: "export"` any more, and enabling it will break
> the site. Static export supports no POST route handlers and no runtime redirects, so it
> would take out `/api/auth/{verify,refresh,logout}` (sign-in and session refresh),
> `/api/contact` (the contact form), and `/app` (the store redirect).
>
> The marketing pages are still statically prerendered by the normal build — three locales
> per route via `generateStaticParams` — so a plain `next build` already gives static HTML
> where it matters, while keeping the handful of server routes that need a server.

On **Vercel**, the default Next.js build is what you want.

## Store submission

After deploy, use your live URLs in App Store Connect and Google Play (Privacy Policy, Terms if required), for example:

- `https://<your-domain>/hy/privacy`
- `https://<your-domain>/hy/terms`

Match the language you set as primary in the consoles, or provide localized URLs for each locale.

## Design

Visual tokens follow `mobile/theme/tokens.ts` and `docs/mobile-design.md` (warm canvas, white cards, brand gradient, Inter).
