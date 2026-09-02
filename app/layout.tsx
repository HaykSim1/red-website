import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { LangAttribute } from "@/components/lang-attribute";

// globals.css is deliberately NOT imported here. It styles bare elements (a, body)
// with un-layered rules, which outrank every Tailwind utility no matter the file
// order — loading it site-wide repainted the app section's buttons as links.
// It is imported by the (marketing) layout and by not-found.tsx instead, so it
// reaches exactly the pages it was written for.

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://redauto.example"),
  title: "Red Auto",
  description: "Red Auto connects buyers and sellers for auto parts in Armenia.",
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/favicon_io/site.webmanifest" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={inter.className}>
        <LangAttribute />
        {children}
      </body>
    </html>
  );
}
