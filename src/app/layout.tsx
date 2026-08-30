import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const editorialFont = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "THE FORGE — Haute Couture & Handmade Custom Dressing",
    template: "%s | THE FORGE",
  },
  description: "International luxury fashion house crafting handmade custom dressing, bespoke suits, couture gowns, bridal wear, and Jalamias for Men and Women.",
  metadataBase: new URL("https://theforgebrand.shop"),
  openGraph: {
    title: "THE FORGE — Haute Couture & Handmade Custom Dressing",
    description: "Bespoke fashion crafted with precision. Explore The Men Forge and The Lady Forge.",
    url: "https://theforgebrand.shop",
    siteName: "THE FORGE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "THE FORGE — Haute Couture & Handmade Custom Dressing",
    description: "Bespoke fashion crafted with precision for Men and Women.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${editorialFont.variable} ${sansFont.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#C6A15B] selection:text-[#050505]"
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
