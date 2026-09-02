import Link from "next/link";

import "./globals.css";

export default function NotFound() {
  return (
    <main className="u-page-padding u-section" style={{ textAlign: "center" }}>
      <div className="u-inner">
        <h1 className="u-display" style={{ marginBottom: "var(--space-md)" }}>
          404
        </h1>
        <p className="u-muted" style={{ marginBottom: "var(--space-xl)" }}>
          Page not found.
        </p>
        <Link className="u-gradient-cta" href="/hy">
          Red Auto home
        </Link>
      </div>
    </main>
  );
}
