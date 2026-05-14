import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Veridion — Inteligentní workspace pro veřejné zakázky",
  description:
    "AI workspace pro monitoring, analýzu a řízení veřejných zakázek. Jeden systém pro celý životní cyklus tendru.",
  metadataBase: new URL("https://veridion.cz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Veridion — Inteligentní workspace pro veřejné zakázky",
    description:
      "AI workspace pro monitoring, analýzu a řízení veřejných zakázek. Jeden systém pro celý životní cyklus tendru.",
    url: "https://veridion.cz",
    siteName: "Veridion",
    type: "website",
    locale: "cs_CZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veridion — Inteligentní workspace pro veřejné zakázky",
    description:
      "AI workspace pro monitoring, analýzu a řízení veřejných zakázek.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={`${inter.variable} dark`}>
      <body className="bg-ink-950 text-silver-100 antialiased selection:bg-accent-500/30">
        {children}
      </body>
    </html>
  );
}
