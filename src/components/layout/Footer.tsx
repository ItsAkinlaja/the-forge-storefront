"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#F8F8F8] dark:bg-[#050505] border-t border-[#E5E5E5] dark:border-[#1C1C1C] text-[#666666] dark:text-[#8E8E93] pt-16 pb-10 transition-colors duration-300">
      <Container size="wide">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-14 border-b border-[#E5E5E5] dark:border-[#1C1C1C]">

          {/* Brand block */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="font-editorial text-2xl text-[#050505] dark:text-white tracking-[0.2em] font-light">THE FORGE</h3>
            <p className="text-xs leading-relaxed max-w-sm text-[#555555] dark:text-[#A0A0A0]">
              A Nigerian fashion brand crafting premium menswear and womenswear from Lagos. From street to boardroom, Jalabias to dinner gowns -- built for the Nigerian who dresses with intention.
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
                <a href="tel:+2348000000000" className="hover:text-[#C6A15B] transition-colors">+234 800 000 0000</a>
              </div>
            </div>
            <p className="text-[9px] text-[#C6A15B] tracking-[0.25em] uppercase font-semibold pt-1">
              All prices in Nigerian Naira (NGN)
            </p>
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
              <li><Link href="/custom-dressing" className="hover:text-[#C6A15B] transition-colors">Book Bespoke Fitting</Link></li>
              <li><Link href="/editorial" className="hover:text-[#050505] dark:hover:text-white transition-colors">Lookbook</Link></li>
              <li><Link href="/account" className="hover:text-[#050505] dark:hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/cart" className="hover:text-[#050505] dark:hover:text-white transition-colors">Shopping Bag</Link></li>
              <li><Link href="/search" className="hover:text-[#050505] dark:hover:text-white transition-colors">Search</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#050505] dark:text-white font-semibold">Stay in the Loop</h4>
            <p className="text-xs text-[#666666] dark:text-[#8E8E93] leading-relaxed">New drops, exclusive offers, and Forge events -- straight to your inbox.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] px-3 py-3 text-xs text-[#050505] dark:text-white focus:outline-none focus:border-[#C6A15B] placeholder:text-[#AAAAAA] dark:placeholder:text-[#555555] rounded-none"
              />
              <Button variant="gold" size="sm" className="w-full py-2.5">Subscribe</Button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#AAAAAA] dark:text-[#444444]">
          <p>
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> The Forge. All Rights Reserved.
            <span className="ml-2 text-[#C6A15B]/60">theforgebrand.shop</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-[#050505] dark:hover:text-[#8E8E93] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#050505] dark:hover:text-[#8E8E93] transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-[#050505] dark:hover:text-[#8E8E93] transition-colors">Sitemap</Link>
          </div>
        </div>

      </Container>
    </footer>
  );
}
