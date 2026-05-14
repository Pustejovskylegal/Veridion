import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
    description: "AI workspace pro monitoring, analýzu a řízení veřejných zakázek.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#5E8BFF",
          colorBackground: "#0A0D12",
          colorInputBackground: "#12161D",
          colorInputText: "#E6EAF1",
          colorText: "#E6EAF1",
          colorTextSecondary: "#9AA3B4",
          colorNeutral: "#252B36",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        },
        elements: {
          card: "bg-ink-900 border border-white/[0.06] shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)]",
          headerTitle: "text-silver-50 tracking-tight",
          headerSubtitle: "text-silver-400",
          socialButtonsBlockButton:
            "bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-silver-100",
          formButtonPrimary:
            "bg-silver-50 hover:bg-white text-ink-950 font-medium shadow-[0_8px_30px_-10px_rgba(255,255,255,0.25)] normal-case",
          footerActionLink: "text-accent-400 hover:text-accent-300",
          formFieldInput:
            "bg-white/[0.03] border border-white/[0.08] text-silver-100 focus:border-accent-500",
          dividerLine: "bg-white/[0.06]",
          dividerText: "text-silver-500",
          identityPreview: "bg-white/[0.03] border border-white/[0.08]",
        },
      }}
    >
      <html lang="cs" className={`${inter.variable} dark`}>
        <body className="bg-ink-950 text-silver-100 antialiased selection:bg-accent-500/30">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
