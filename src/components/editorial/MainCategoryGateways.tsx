"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/theme/ThemeContext";
import { ArrowUpRight } from "lucide-react";

export function MainCategoryGateways() {
  const { theme } = useTheme();

  return (
    <section className="bg-white dark:bg-[#050505] transition-colors duration-300">

      {/* Section header */}
      <div className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] py-12 sm:py-16">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold">
                Two Master Pillars
              </p>
              <h2 className="font-editorial text-4xl sm:text-5xl text-[#050505] dark:text-white font-light tracking-tight">
                Choose Your Realm
              </h2>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#8E8E93] max-w-xs leading-relaxed">
              Every garment from THE FORGE is cut, sewn, and embellished individually for your unique silhouette.
            </p>
          </div>
        </Container>
      </div>

      {/* Dark mode: full-bleed cinematic image cards */}
      {theme === "dark" && (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Men Forge */}
          <div className="relative group overflow-hidden h-[70vh] min-h-[500px] flex flex-col justify-end p-8 sm:p-14 border-r-0 lg:border-r border-[#1C1C1C]">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85"
                alt="The Men Forge"
                fill
                className="object-cover object-top brightness-[0.45] group-hover:brightness-[0.55] group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#C6A15B] font-semibold">Bespoke and Traditional Refined</p>
              <h3 className="font-editorial text-4xl sm:text-5xl text-white font-light">The Men Forge</h3>
              <p className="text-xs text-[#B0B0B0] max-w-sm font-light leading-relaxed">
                Imperial velvet tuxedos, gold-embroidered silk Jalamias, tailored cashmere coats, and custom fitted trousers.
              </p>
              <div className="flex flex-wrap gap-2 text-[9px] text-[#C6A15B] tracking-widest uppercase font-semibold">
                <span className="border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-2.5 py-1">Suits</span>
                <span className="border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-2.5 py-1">Jalamias</span>
                <span className="border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-2.5 py-1">Overcoats</span>
              </div>
              <Link href="/the-men-forge">
                <Button variant="gold" size="md" className="mt-2">Enter The Men Forge</Button>
              </Link>
            </div>
          </div>

          {/* Lady Forge */}
          <div className="relative group overflow-hidden h-[70vh] min-h-[500px] flex flex-col justify-end p-8 sm:p-14">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85"
                alt="The Lady Forge"
                fill
                className="object-cover object-top brightness-[0.45] group-hover:brightness-[0.55] group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#C6A15B] font-semibold">Haute Couture and Bridal</p>
              <h3 className="font-editorial text-4xl sm:text-5xl text-white font-light">The Lady Forge</h3>
              <p className="text-xs text-[#B0B0B0] max-w-sm font-light leading-relaxed">
                Artisanal wedding dresses, French lace cathedral bridalwear, obsidian velvet gala gowns, and tailored silk suit sets.
              </p>
              <div className="flex flex-wrap gap-2 text-[9px] text-[#C6A15B] tracking-widest uppercase font-semibold">
                <span className="border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-2.5 py-1">Bridal</span>
                <span className="border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-2.5 py-1">Gowns</span>
                <span className="border border-[#C6A15B]/30 bg-[#C6A15B]/10 px-2.5 py-1">Silk Suits</span>
              </div>
              <Link href="/the-lady-forge">
                <Button variant="outline" size="md" className="mt-2 border-white/50 text-white hover:border-[#C6A15B] hover:text-[#C6A15B]">Enter The Lady Forge</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Light mode: editorial grid with clean typography */}
      {theme === "light" && (
        <Container size="wide" className="py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#E5E5E5]">
            {/* Men Forge */}
            <div className="group bg-white p-10 sm:p-14 space-y-6 hover:bg-[#FAFAFA] transition-colors">
              <div className="relative h-80 w-full overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85"
                  alt="The Men Forge"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C6A15B] font-semibold">Bespoke and Traditional</p>
                <h3 className="font-editorial text-4xl text-[#050505] font-light">The Men Forge</h3>
                <p className="text-xs text-[#666666] leading-relaxed max-w-sm">
                  Imperial velvet tuxedos, gold-embroidered silk Jalamias, tailored cashmere coats, and custom trousers.
                </p>
              </div>
              <Link href="/the-men-forge" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#050505] font-semibold hover:text-[#C6A15B] transition-colors border-b border-[#050505] hover:border-[#C6A15B] pb-0.5">
                Explore Collection <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Lady Forge */}
            <div className="group bg-white p-10 sm:p-14 space-y-6 hover:bg-[#FAFAFA] transition-colors">
              <div className="relative h-80 w-full overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85"
                  alt="The Lady Forge"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#C6A15B] font-semibold">Haute Couture and Bridal</p>
                <h3 className="font-editorial text-4xl text-[#050505] font-light">The Lady Forge</h3>
                <p className="text-xs text-[#666666] leading-relaxed max-w-sm">
                  Artisanal wedding dresses, French lace cathedral bridalwear, gala gowns, and tailored silk suit sets.
                </p>
              </div>
              <Link href="/the-lady-forge" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#050505] font-semibold hover:text-[#C6A15B] transition-colors border-b border-[#050505] hover:border-[#C6A15B] pb-0.5">
                Explore Collection <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Container>
      )}

    </section>
  );
}