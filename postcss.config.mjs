/**
 * Tailwind v4 is used ONLY by the authenticated app section
 * (app/[lang]/(app) and app/[lang]/(auth)). The marketing pages keep their
 * hand-written CSS in app/globals.css — see app/[lang]/(app)/app.css for how
 * the two are kept apart.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
