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
    "AI-poháněný enterprise workspace pro monitoring, analýzu a řízení veřejných zakázek. Jeden systém pro celý životní cyklus tendru.",
  metadataBase: new URL("https://veridion.ai"),
  openGraph: {
    title: "Veridion — Inteligentní workspace pro veřejné zakázky",
    description:
      "AI-poháněný enterprise workspace pro monitoring, analýzu a řízení veřejných zakázek.",
    type: "website",
    locale: "cs_CZ",
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
