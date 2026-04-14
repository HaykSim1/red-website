# Red Auto marketing website

Static marketing site for **Red Auto** (hy / en / ru): landing (hero, value props, how it works, buyers/sellers, FAQ teaser, screenshots, **contact form + info** two-column block), **FAQ**, **Trust & safety**, **Privacy**, **Terms**, store badges (App Store + Google Play), footer social links, `sitemap.xml`, and `robots.txt`.

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
npm run dev    # local dev server (http://localhost:3000 → redirects to /hy)
npm run build  # production build
npm run start  # run production server locally
npm run lint
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

## Fully static export (optional)

For hosts that only serve static files, enable static HTML export in `next.config.ts`:

```ts
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};
```

Then `npm run build` writes `out/`. Note: `next start` does not apply to `output: "export"`; use any static file server instead.

On **Vercel**, the default Next.js build (without `output: "export"`) is usually enough.

## Store submission

After deploy, use your live URLs in App Store Connect and Google Play (Privacy Policy, Terms if required), for example:

- `https://<your-domain>/hy/privacy`
- `https://<your-domain>/hy/terms`

Match the language you set as primary in the consoles, or provide localized URLs for each locale.

## Design

Visual tokens follow `mobile/theme/tokens.ts` and `docs/mobile-design.md` (warm canvas, white cards, brand gradient, Inter).
