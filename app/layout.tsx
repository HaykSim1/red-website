import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { LangAttribute } from "@/components/lang-attribute";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Red Auto",
  description: "Red Auto connects buyers and sellers for auto parts in Armenia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" suppressHydrationWarning>
      <body className={inter.className}>
        <LangAttribute />
        {children}
      </body>
    </html>
  );
}
