"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const GALLERY = [
  // The Lady Forge
  { id: 1,  src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4940.jpg",            alt: "The Forge Look",     category: "The Lady Forge",  span: "row-span-2" },
  { id: 2,  src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4747.JPG.jpeg",       alt: "The Forge Style",    category: "The Lady Forge",  span: "" },
  { id: 3,  src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4751.JPG.jpeg",       alt: "The Forge Drip",     category: "The Lady Forge",  span: "" },
  { id: 4,  src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4936-scaled.jpg",     alt: "Forge Editorial",    category: "The Lady Forge",  span: "row-span-2" },
  { id: 5,  src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4943-scaled.jpg",     alt: "Forge Campaign",     category: "The Lady Forge",  span: "" },
  { id: 6,  src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4935-scaled.jpg",     alt: "Forge Identity",     category: "The Lady Forge",  span: "" },
  { id: 7,  src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4938-scaled.jpg",     alt: "Forge Movement",     category: "The Lady Forge",  span: "row-span-2" },
  // The Men Forge
  { id: 8,  src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_6389.JPG-scaled.jpeg",alt: "Forge Culture",      category: "The Men Forge",   span: "" },
  { id: 9,  src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_7466.JPG-scaled.jpeg",alt: "Forge Lagos",        category: "The Men Forge",   span: "row-span-2" },
  { id: 10, src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_7441.JPG-scaled.jpeg",alt: "Forge Looks",        category: "The Men Forge",   span: "" },
  { id: 11, src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_7447.JPG-scaled.jpeg",alt: "Forge Vibes",        category: "The Men Forge",   span: "" },
  { id: 12, src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_7429.JPG-scaled.jpeg",alt: "Forge Collection",   category: "The Men Forge",   span: "row-span-2" },
  { id: 13, src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_7478.JPG-scaled.jpeg",alt: "Forge Statement",    category: "The Men Forge",   span: "" },
  { id: 14, src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_7443.JPG-scaled.jpeg",alt: "Forge Authenticity", category: "The Men Forge",   span: "" },
  { id: 15, src: "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_7425.JPG-scaled.jpeg",alt: "Forge Original",     category: "The Men Forge",   span: "" },
];

type GalleryItem = typeof GALLERY[0];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [filter, setFilter]     = useState<"All" | "The Men Forge" | "The Lady Forge">("All");

  const filtered = filter === "All" ? GALLERY : GALLERY.filter(g => g.category === filter);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">

        {/* Header */}
        <section className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] py-16 sm:py-20">
          <Container size="default">
            <div className="max-w-xl mx-auto text-center space-y-4">
              <p className="text-[9px] uppercase tracking-[0.5em] text-[#C6A15B] font-sans font-semibold">
                Lagos Made. African Original.
              </p>
              <h1 className="font-editorial text-5xl sm:text-6xl text-[#050505] dark:text-white font-light">
                Forge Gallery
              </h1>
              <p className="text-xs text-[#666666] dark:text-[#8E8E93] font-sans font-light leading-relaxed">
                Real looks. Real people. Real drip from The Forge.
              </p>
            </div>
          </Container>
        </section>

        {/* Filter tabs */}
        <section className="sticky top-[57px] sm:top-[65px] z-30 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#1C1C1C]">
          <Container size="wide">
            <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none">
              {(["All", "The Men Forge", "The Lady Forge"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-shrink-0 px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold transition-all ${
                    filter === tab
                      ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505]"
                      : "text-[#888888] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <span className="ml-auto text-[9px] text-[#CCCCCC] dark:text-[#333333] uppercase tracking-widest font-sans flex-shrink-0">
                {filtered.length} photos
              </span>
            </div>
          </Container>
        </section>

        {/* Masonry grid */}
        <section className="py-10 bg-white dark:bg-[#050505]">
          <Container size="wide">
            {/* Mobile: 2-col uniform grid */}
            <div className="grid grid-cols-2 gap-1 sm:hidden">
              {filtered.map(item => (
                <button
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className="group relative overflow-hidden aspect-square bg-[#F5F5F5] dark:bg-[#111111]"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#C6A15B] font-sans">{item.category}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop: proper masonry-style auto-rows grid */}
            <div className="hidden sm:grid grid-cols-3 lg:grid-cols-4 gap-1" style={{ gridAutoRows: "240px" }}>
              {filtered.map(item => (
                <button
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className={`group relative overflow-hidden bg-[#F5F5F5] dark:bg-[#111111] ${item.span}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1200px) 33vw, 25vw"
                  />
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                  {/* Label slides up on hover */}
                  <div className="absolute bottom-0 inset-x-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#C6A15B] font-sans font-semibold">{item.category}</p>
                    <p className="font-editorial text-lg text-white font-light mt-1">{item.alt}</p>
                  </div>

                  {/* Corner arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </button>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA strip */}
        <section className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] py-14 bg-[#F9F9F9] dark:bg-[#0A0A0A]">
          <Container size="wide">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold">Ready to wear your story?</p>
                <p className="font-editorial text-3xl text-[#050505] dark:text-white font-light">Start your Forge journey.</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                <Link href="/the-men-forge"><Button variant="primary" size="md">The Men Forge</Button></Link>
                <Link href="/the-lady-forge"><Button variant="gold" size="md">The Lady Forge</Button></Link>
              </div>
            </div>
          </Container>
        </section>

      </main>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-2xl max-h-[90vh] aspect-[3/4] sm:aspect-auto sm:h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center space-y-1">
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#C6A15B] font-sans">{lightbox.category}</p>
            <p className="font-editorial text-xl text-white font-light">{lightbox.alt}</p>
          </div>

          {/* Prev / Next */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-3xl font-light"
            onClick={e => { e.stopPropagation(); const idx = filtered.findIndex(g => g.id === lightbox.id); setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length]); }}
          >
            &#8592;
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-3xl font-light"
            onClick={e => { e.stopPropagation(); const idx = filtered.findIndex(g => g.id === lightbox.id); setLightbox(filtered[(idx + 1) % filtered.length]); }}
          >
            &#8594;
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
