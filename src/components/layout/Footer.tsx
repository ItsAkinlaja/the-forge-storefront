"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="bg-[#F8F8F8] dark:bg-[#050505] border-t border-[#E5E5E5] dark:border-[#1C1C1C] text-[#666666] dark:text-[#8E8E93] pt-16 pb-12 transition-colors duration-300">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#E5E5E5] dark:border-[#1C1C1C]">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-editorial text-2xl text-[#050505] dark:text-white tracking-[0.2em] font-light">THE FORGE</h3>
            <p className="text-xs leading-relaxed max-w-sm text-[#555555] dark:text-[#A0A0A0]">
              An international fashion house dedicated to bespoke craftsmanship. Every seam, embroidery motif, and pattern is handmade for discerning gentlemen and ladies.
            </p>
            <p className="text-[10px] text-[#C6A15B] tracking-[0.2em] uppercase font-semibold">
              ATELIER LAGOS -- ABUJA -- LONDON -- PARIS -- NEW YORK
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold">The Men Forge</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/the-men-forge/suits-blazers" className="hover:text-[#050505] dark:hover:text-white transition-colors">Suits and Tuxedos</Link></li>
              <li><Link href="/the-men-forge/jalamia-kaftans" className="hover:text-[#C6A15B] transition-colors text-[#050505] dark:text-white font-medium">Jalamia and Kaftans</Link></li>
              <li><Link href="/the-men-forge/luxury-coats" className="hover:text-[#050505] dark:hover:text-white transition-colors">Luxury Overcoats</Link></li>
              <li><Link href="/the-men-forge/custom-trousers" className="hover:text-[#050505] dark:hover:text-white transition-colors">Custom Trousers</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold">The Lady Forge</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/the-lady-forge/wedding-dresses" className="hover:text-[#C6A15B] transition-colors text-[#050505] dark:text-white font-medium">Wedding Dresses and Bridal</Link></li>
              <li><Link href="/the-lady-forge/couture-gowns" className="hover:text-[#050505] dark:hover:text-white transition-colors">Couture Gala Gowns</Link></li>
              <li><Link href="/the-lady-forge/tailored-suits" className="hover:text-[#050505] dark:hover:text-white transition-colors">Tailored Suit Sets</Link></li>
              <li><Link href="/the-lady-forge/corsetry-bustiers" className="hover:text-[#050505] dark:hover:text-white transition-colors">Corsetry and Bustiers</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#050505] dark:text-white font-semibold">Atelier Newsletter</h4>
            <p className="text-xs text-[#666666] dark:text-[#8E8E93]">Receive private invitations to seasonal trunk shows and bespoke releases.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input type="email" placeholder="ENTER YOUR EMAIL" className="w-full bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] px-3 py-2.5 text-xs text-[#050505] dark:text-white focus:outline-none focus:border-[#C6A15B] placeholder:text-[#888888]" />
              <Button variant="gold" size="sm" className="w-full py-2.5">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#888888] dark:text-[#555555] space-y-4 sm:space-y-0">
          <p>Copyright <span suppressHydrationWarning>{new Date().getFullYear()}</span> THE FORGE. All Rights Reserved. theforgebrand.shop</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#050505] dark:hover:text-[#8E8E93]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#050505] dark:hover:text-[#8E8E93]">Terms of Bespoke Service</Link>
            <Link href="/sitemap" className="hover:text-[#050505] dark:hover:text-[#8E8E93]">Sitemap</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}