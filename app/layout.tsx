import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { LangAttribute } from "@/components/lang-attribute";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://redauto.example"),
  title: "Red Auto",
  description: "Red Auto connects buyers and sellers for auto parts in Armenia.",
  icons: {
    icon: "/favicon.ico",
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
