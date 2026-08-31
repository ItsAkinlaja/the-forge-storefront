"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/theme/ThemeContext";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail } from "lucide-react";

const WP_BASE = "https://central.theforgebrand.shop";

const FOOTER_LOGO_LIGHT = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4180.JPG-1-e1788157143811.jpeg";
const FOOTER_LOGO_DARK  = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4179-1-e1788157194913.jpg";

function FooterLogo() {
  const { theme } = useTheme();
  const src = theme === "dark" ? FOOTER_LOGO_DARK : FOOTER_LOGO_LIGHT;
  return (
    <div className="relative h-14 w-44">
      <Image
        key={src}
        src={src}
        alt="THE FORGE"
        fill
        className="object-contain object-left transition-opacity duration-300"
        sizes="176px"
      />
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail]     = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`${WP_BASE}/wp-json/forge/v1/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Something went wrong.");
      setStatus("success");
      setMessage("You are on the list.");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not subscribe. Try again.");
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#050505] dark:text-white font-semibold">Stay in the Loop</h4>
      <p className="text-xs text-[#666666] dark:text-[#8E8E93] leading-relaxed">New drops, exclusive offers, and Forge events -- straight to your inbox.</p>
      {status === "success" ? (
        <p className="text-xs text-[#C6A15B] font-sans py-2">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] px-3 py-3 text-xs text-[#050505] dark:text-white focus:outline-none focus:border-[#C6A15B] placeholder:text-[#AAAAAA] dark:placeholder:text-[#555555] rounded-none"
          />
          {status === "error" && (
            <p className="text-[11px] text-red-500 font-sans">{message}</p>
          )}
          <Button variant="gold" size="sm" className="w-full py-2.5" disabled={status === "loading"}>
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#F8F8F8] dark:bg-[#050505] border-t border-[#E5E5E5] dark:border-[#1C1C1C] text-[#666666] dark:text-[#8E8E93] pt-16 pb-10 transition-colors duration-300">
      <Container size="wide">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-14 border-b border-[#E5E5E5] dark:border-[#1C1C1C]">

          {/* Brand block */}
          <div className="lg:col-span-2 space-y-5">
            <FooterLogo />
            <p className="text-xs leading-relaxed max-w-sm text-[#555555] dark:text-[#A0A0A0]">
              Rooted in African culture. Built for everyone who dresses with purpose. From everyday street looks to dinner gowns, Jalabias to blazers -- The Forge is for the bold, wherever you are in the world.
            </p>
            <div className="space-y-2 text-xs text-[#666666] dark:text-[#8E8E93]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C6A15B] flex-shrink-0 mt-0.5" />
                <span>First Access Building, beside Classic at Mayfair, Lagos</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C6A15B] flex-shrink-0" />
                <a href="mailto:hello@theforgebrand.shop" className="hover:text-[#C6A15B] transition-colors">hello@theforgebrand.shop</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C6A15B] flex-shrink-0" />
                <a href="tel:+2349030849619" className="hover:text-[#C6A15B] transition-colors">09030849619</a>
              </div>
            </div>
            <p className="text-[9px] text-[#C6A15B] tracking-[0.25em] uppercase font-semibold pt-1">
              All prices in Nigerian Naira (NGN)
            </p>

            {/* Social handles */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram - The Men Forge */}
              <a
                href="https://www.instagram.com/the_men_forge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] text-[#888888] dark:text-[#555555] hover:text-[#C6A15B] transition-colors font-sans"
                aria-label="The Men Forge on Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                @the_men_forge
              </a>

              <span className="w-px h-3 bg-[#E5E5E5] dark:bg-[#262626]" />

              {/* Instagram - The Lady Forge */}
              <a
                href="https://www.instagram.com/the_lady_forge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] text-[#888888] dark:text-[#555555] hover:text-[#C6A15B] transition-colors font-sans"
                aria-label="The Lady Forge on Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                @the_lady_forge
              </a>
            </div>

            {/* TikTok handles */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.tiktok.com/@the_men_forge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] text-[#888888] dark:text-[#555555] hover:text-[#C6A15B] transition-colors font-sans"
                aria-label="The Men Forge on TikTok"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                </svg>
                @the_men_forge
              </a>
              <span className="w-px h-3 bg-[#E5E5E5] dark:bg-[#262626]" />
              <a
                href="https://www.tiktok.com/@the_lady_forge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] text-[#888888] dark:text-[#555555] hover:text-[#C6A15B] transition-colors font-sans"
                aria-label="The Lady Forge on TikTok"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                </svg>
                @the_lady_forge
              </a>
            </div>
          </div>

          {/* Men Forge */}
          <div className="space-y-3">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold">The Men Forge</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/the-men-forge/vintage-shirts" className="hover:text-[#050505] dark:hover:text-white transition-colors">Vintage by Forge</Link></li>
              <li><Link href="/the-men-forge/streetwear" className="hover:text-[#050505] dark:hover:text-white transition-colors">Streetwear</Link></li>
              <li><Link href="/the-men-forge/pants" className="hover:text-[#050505] dark:hover:text-white transition-colors">Pants</Link></li>
              <li><Link href="/the-men-forge/two-piece" className="hover:text-[#050505] dark:hover:text-white transition-colors">2-Piece Outfits</Link></li>
              <li><Link href="/the-men-forge/jalabias" className="hover:text-[#C6A15B] transition-colors font-medium text-[#050505] dark:text-white">Jalabias</Link></li>
              <li><Link href="/the-men-forge/danshiki" className="hover:text-[#050505] dark:hover:text-white transition-colors">Danshiki</Link></li>
              <li><Link href="/the-men-forge/caps" className="hover:text-[#050505] dark:hover:text-white transition-colors">Caps</Link></li>
            </ul>
          </div>

          {/* Lady Forge */}
          <div className="space-y-3">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold">The Lady Forge</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/the-lady-forge/corporate-dresses" className="hover:text-[#C6A15B] transition-colors font-medium text-[#050505] dark:text-white">Corporate Dresses</Link></li>
              <li><Link href="/the-lady-forge/blazers" className="hover:text-[#050505] dark:hover:text-white transition-colors">Blazers</Link></li>
              <li><Link href="/the-lady-forge/two-piece" className="hover:text-[#050505] dark:hover:text-white transition-colors">2-Piece Outfits</Link></li>
              <li><Link href="/the-lady-forge/dinner-birthday" className="hover:text-[#050505] dark:hover:text-white transition-colors">Dinner and Birthday</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#050505] dark:text-white font-semibold">Information</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/custom-dressing" className="hover:text-[#C6A15B] transition-colors">Book Custom Fitting</Link></li>
              <li><Link href="/editorial" className="hover:text-[#050505] dark:hover:text-white transition-colors">Lookbook</Link></li>
              <li><Link href="/account" className="hover:text-[#050505] dark:hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/cart" className="hover:text-[#050505] dark:hover:text-white transition-colors">Shopping Bag</Link></li>
              <li><Link href="/search" className="hover:text-[#050505] dark:hover:text-white transition-colors">Search</Link></li>
              <li><Link href="/size-guide" className="hover:text-[#C6A15B] transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <NewsletterForm />

        </div>

        {/* Payment methods */}
        <div className="py-6 border-b border-[#E5E5E5] dark:border-[#1C1C1C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#AAAAAA] dark:text-[#444444] font-sans">Secure Payment Methods</p>
          <div className="flex items-center gap-2 flex-wrap">

            {/* Visa */}
            <div className="h-8 px-3 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#262626] flex items-center justify-center">
              <svg viewBox="0 0 780 500" xmlns="http://www.w3.org/2000/svg" className="h-4 w-auto">
                <rect width="780" height="500" rx="40" fill="white"/>
                <path d="M290 330L326 170H370L334 330H290Z" fill="#1A1F71"/>
                <path d="M492 174C483 171 469 168 452 168C408 168 376 191 376 224C376 249 399 263 416 271C433 280 438 285 438 293C438 305 424 311 411 311C393 311 384 308 368 301L361 298L354 339C365 344 385 348 406 348C453 348 484 325 485 289C485 269 473 254 448 242C432 234 422 228 422 219C422 209 432 199 454 199C473 199 487 203 497 207L502 210L492 174Z" fill="#1A1F71"/>
                <path d="M554 170H520C509 170 501 173 496 185L432 330H479L488 305H545L550 330H592L554 170ZM499 271C502 262 517 222 517 222C517 222 521 212 524 206L527 221C527 221 537 267 539 271H499Z" fill="#1A1F71"/>
                <path d="M246 170L203 283L198 259C190 233 167 205 141 191L180 330H228L297 170H246Z" fill="#1A1F71"/>
                <path d="M167 170H93L92 174C149 188 188 222 198 259L188 185C185 173 177 170 167 170Z" fill="#F9A533"/>
              </svg>
            </div>

            {/* Mastercard */}
            <div className="h-8 px-2 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#262626] flex items-center justify-center">
              <svg viewBox="0 0 131.39 86.9" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <rect width="131.39" height="86.9" rx="8" fill="white"/>
                <circle cx="48.37" cy="43.45" r="28.5" fill="#EB001B"/>
                <circle cx="83.02" cy="43.45" r="28.5" fill="#F79E1B"/>
                <path d="M65.7 19.7a28.5 28.5 0 0 1 0 47.5 28.5 28.5 0 0 1 0-47.5z" fill="#FF5F00"/>
              </svg>
            </div>

            {/* Verve */}
            <div className="h-8 px-3 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#262626] flex items-center justify-center">
              <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="h-4 w-auto">
                <rect width="200" height="80" rx="6" fill="white"/>
                <rect x="10" y="10" width="180" height="60" rx="4" fill="#1B2B7E"/>
                <polygon points="40,55 65,25 90,55 80,55 65,37 50,55" fill="#F7941D"/>
                <text x="100" y="50" fontFamily="Arial" fontWeight="bold" fontSize="22" fill="white" textAnchor="middle">VERVE</text>
              </svg>
            </div>

            {/* Paystack */}
            <div className="h-8 px-3 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#262626] flex items-center justify-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                <rect width="24" height="24" rx="4" fill="#00C3F7"/>
                <path d="M5 12h14M5 8h14M5 16h9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[9px] font-bold tracking-[0.1em] text-[#00C3F7] font-sans uppercase">Paystack</span>
            </div>

            {/* Bank Transfer */}
            <div className="h-8 px-3 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#262626] flex items-center justify-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#050505] dark:text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[9px] font-semibold tracking-[0.05em] text-[#555555] dark:text-[#888888] font-sans uppercase">Bank Transfer</span>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#AAAAAA] dark:text-[#444444]">
          <p>
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> The Forge. All Rights Reserved.
            <span className="ml-2 text-[#C6A15B]/60">theforgebrand.shop</span>
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-[#050505] dark:hover:text-[#8E8E93] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#050505] dark:hover:text-[#8E8E93] transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Designer credit -- centred */}
        <div className="pt-5 text-center">
          <a
            href="https://www.akinlajatimileyin.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] uppercase tracking-[0.3em] text-[#CCCCCC] dark:text-[#333333] hover:text-[#C6A15B] dark:hover:text-[#C6A15B] transition-colors font-sans"
          >
            Designed and Developed by Akinlaja
          </a>
        </div>

      </Container>
    </footer>
  );
}
