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

const OG_IMAGE = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4180.JPG-2.jpeg";
const SITE_URL = "https://www.theforgebrand.shop";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "THE FORGE — Dare it, Wear it!",
    template: "%s | THE FORGE",
  },
  description:
    "Rooted in African culture. Built for everyone who dresses with purpose. From street looks to dinner gowns, Jalabias to blazers — The Forge is for the bold, wherever you are.",

  /*
   * Favicon is handled automatically by Next.js App Router.
   * It detects src/app/icon.jpg and src/app/apple-icon.jpg.
   * No manual icons config needed here.
   */

  openGraph: {
    title: "THE FORGE — Dare it, Wear it!",
    description:
      "Premium fashion for Men and Women. Vintage shirts, streetwear, jalabias, corporate dresses, dinner gowns and more.",
    url: SITE_URL,
    siteName: "THE FORGE",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "THE FORGE — Dare it, Wear it!",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "THE FORGE — Dare it, Wear it!",
    description: "Premium fashion for Men and Women. Dare it, Wear it!",
    images: [OG_IMAGE],
  },

  alternates: {
    canonical: SITE_URL,
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
