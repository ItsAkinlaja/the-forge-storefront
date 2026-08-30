import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";

const lookbooks = [
  {
    id: 1,
    title: "The Imperial Court -- Lagos and Paris Menswear",
    category: "The Men Forge",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
    link: "/the-men-forge",
  },
  {
    id: 2,
    title: "Aurelia Bridal and Couture Gowns",
    category: "The Lady Forge",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85",
    link: "/the-lady-forge",
  },
  {
    id: 3,
    title: "Sovereign Kaftans and Regal Jalamias",
    category: "The Men Forge",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    link: "/the-men-forge/jalamia-kaftans",
  },
  {
    id: 4,
    title: "Obsidian Velvet Red Carpet Galas",
    category: "The Lady Forge",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85",
    link: "/the-lady-forge/couture-gowns",
  },
];

export default function EditorialPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] py-20 bg-white dark:bg-[#050505]">
          <Container size="default">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="text-[10px] uppercase tracking-[0.45em] text-[#C6A15B] font-semibold">Editorial Campaigns and Lookbooks</p>
              <h1 className="font-editorial text-5xl sm:text-6xl text-[#050505] dark:text-white font-light">The Forge Archive</h1>
              <p className="text-xs sm:text-sm text-[#666666] dark:text-[#8E8E93] font-light leading-relaxed">
                Seasonal campaigns celebrating African originality, Lagos culture, and fashion that is made to be lived in.
              </p>
            </div>
          </Container>
        </section>

        {/* Lookbook grid */}
        <section className="py-16 bg-white dark:bg-[#050505]">
          <Container size="wide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E5E5E5] dark:bg-[#1C1C1C]">
              {lookbooks.map(item => (
                <div key={item.id} className="group relative bg-[#050505] overflow-hidden flex flex-col justify-end min-h-[500px] p-8 sm:p-12">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center brightness-[0.4] group-hover:brightness-[0.5] group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-transparent" />
                  <div className="relative z-10 space-y-3">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C6A15B] font-semibold">{item.category}</p>
                    <h2 className="font-editorial text-2xl sm:text-3xl text-white font-light leading-tight">{item.title}</h2>
                    <Link href={item.link}>
                      <Button variant="gold" size="sm" className="mt-2">Explore Campaign</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Light mode editorial strip */}
        <section className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] py-16 bg-[#F9F9F9] dark:bg-[#0A0A0A]">
          <Container size="wide">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold">Ready to wear your story?</p>
                <p className="font-editorial text-3xl text-[#050505] dark:text-white font-light">Start your Forge journey.</p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Link href="/custom-dressing">
                  <Button variant="gold" size="md">Book Consultation</Button>
                </Link>
                <Link href="/the-men-forge" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#050505] dark:text-white font-semibold border-b border-[#050505] dark:border-white hover:text-[#C6A15B] hover:border-[#C6A15B] transition-colors pb-0.5 self-center">
                  Browse Catalog <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}