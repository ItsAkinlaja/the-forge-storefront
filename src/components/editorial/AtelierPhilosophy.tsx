"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/theme/ThemeContext";
import { Scissors, ShieldCheck, Gem } from "lucide-react";

const pillars = [
  {
    icon: Scissors,
    title: "Hand Cut Pattern",
    desc: "Individual paper pattern drafted for your exact posture and measurements.",
  },
  {
    icon: Gem,
    title: "24K Gold Embroidery",
    desc: "Hand-stitched metallic filigree details by master embroiderers.",
  },
  {
    icon: ShieldCheck,
    title: "Bespoke Guarantee",
    desc: "Master tailor consultation until you achieve the perfect fit.",
  },
];

export function AtelierPhilosophy() {
  const { theme } = useTheme();

  return (
    <section className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] transition-colors duration-300">

      {/* Dark mode: dark bg with gold accents */}
      {theme === "dark" && (
        <div className="bg-[#050505] py-24 sm:py-32">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.45em] text-[#C6A15B] font-semibold">The Atelier Philosophy</p>
                  <h2 className="font-editorial text-5xl sm:text-6xl text-white font-light leading-[1] tracking-tight">
                    Master Cutters.<br />
                    <span className="italic font-normal gold-gradient-text">Unrivaled Precision.</span>
                  </h2>
                </div>
                <p className="text-sm text-[#8E8E93] leading-relaxed font-light max-w-lg">
                  At THE FORGE, we do not believe in mass production. Every tuxedo, royal kaftan Jalamia, and cathedral bridal dress begins as an individual paper pattern drafted specifically for your posture and measurements.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-[#1C1C1C]">
                  {pillars.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="space-y-2 pt-6">
                      <Icon className="w-5 h-5 text-[#C6A15B]" />
                      <h4 className="font-editorial text-lg text-white">{title}</h4>
                      <p className="text-[11px] text-[#8E8E93] leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link href="/custom-dressing">
                    <Button variant="gold" size="lg">Book Private Atelier Consultation</Button>
                  </Link>
                </div>
              </div>

              {/* Quote card */}
              <div className="relative border border-[#1C1C1C] bg-[#0A0A0A] p-10 sm:p-14 space-y-6">
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[#C6A15B]/40 translate-x-2 -translate-y-2" />
                <span className="font-editorial text-7xl text-[#C6A15B] leading-none select-none opacity-30 block -mb-4">"</span>
                <p className="font-editorial text-2xl sm:text-3xl text-white font-light leading-snug italic">
                  Garments produced with dignity, cut by hand, and finished to regal standards. This is THE FORGE signature.
                </p>
                <div className="pt-6 border-t border-[#1C1C1C] space-y-1">
                  <p className="text-xs tracking-[0.2em] text-[#C6A15B] uppercase font-semibold font-sans">Director of Haute Couture</p>
                  <p className="text-[10px] text-[#555555] uppercase tracking-wider font-sans">The Forge Atelier</p>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Light mode: stark white with black and structure */}
      {theme === "light" && (
        <div className="bg-white py-24 sm:py-32">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-[#E5E5E5]">
              {/* Left large text block */}
              <div className="lg:col-span-3 p-10 sm:p-16 space-y-8 border-b lg:border-b-0 lg:border-r border-[#E5E5E5]">
                <p className="text-[10px] uppercase tracking-[0.45em] text-[#C6A15B] font-semibold">The Atelier Philosophy</p>
                <h2 className="font-editorial text-5xl sm:text-6xl text-[#050505] font-light leading-[1] tracking-tight">
                  Master Cutters.<br />
                  <span className="italic font-normal gold-gradient-text">Unrivaled Precision.</span>
                </h2>
                <p className="text-sm text-[#555555] leading-relaxed font-light max-w-lg">
                  At THE FORGE, we do not believe in mass production. Every tuxedo, royal kaftan Jalamia, and cathedral bridal dress begins as an individual paper pattern drafted specifically for your posture and measurements.
                </p>
                <Link href="/custom-dressing">
                  <Button variant="primary" size="lg">Book Private Atelier Consultation</Button>
                </Link>
              </div>

              {/* Right: pillars stacked */}
              <div className="lg:col-span-2 divide-y divide-[#E5E5E5]">
                {pillars.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="p-8 space-y-3">
                    <Icon className="w-5 h-5 text-[#C6A15B]" />
                    <h4 className="font-editorial text-xl text-[#050505]">{title}</h4>
                    <p className="text-xs text-[#666666] leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Full-width quote bar */}
            <div className="mt-px border border-t-0 border-[#E5E5E5] p-8 sm:p-12 bg-[#050505]">
              <p className="font-editorial text-2xl sm:text-3xl text-white font-light leading-snug italic max-w-3xl">
                "Garments produced with dignity, cut by hand, and finished to regal standards. This is THE FORGE signature."
              </p>
              <p className="mt-4 text-[10px] tracking-[0.3em] text-[#C6A15B] uppercase font-semibold font-sans">
                Director of Haute Couture, The Forge Atelier
              </p>
            </div>
          </Container>
        </div>
      )}

    </section>
  );
}