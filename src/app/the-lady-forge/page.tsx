"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { CustomFitDrawer } from "@/components/ecommerce/CustomFitDrawer";
import { wpClient } from "@/lib/wordpress/client";
import { Product, LadySubcategory } from "@/types";

const FILTERS: { label: string; value: LadySubcategory | "all" }[] = [
  { label: "All Collection", value: "all" },
  { label: "Wedding and Bridal", value: "wedding-dresses" },
  { label: "Couture Gowns", value: "couture-gowns" },
  { label: "Tailored Suits", value: "tailored-suits" },
];

export default function LadyForgePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<LadySubcategory | "all">("all");
  const [selectedProductForFit, setSelectedProductForFit] = useState<Product | null>(null);

  useEffect(() => {
    wpClient.getProducts({ mainCategory: "the-lady-forge" }).then(setProducts);
  }, []);

  const filtered = selectedSubcategory === "all" ? products : products.filter(p => p.subcategory === selectedSubcategory);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="relative h-[50vh] min-h-[380px] w-full flex items-end justify-start overflow-hidden border-b border-[#E5E5E5] dark:border-[#1C1C1C]">
          <Image
            src="https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1800&q=85"
            alt="The Lady Forge Collection"
            fill
            priority
            className="object-cover object-top brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
          <div className="relative z-10 px-8 sm:px-16 pb-12 sm:pb-16 space-y-3 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C6A15B] font-semibold">
              Haute Couture and Bespoke Bridalwear
            </p>
            <h1 className="font-editorial text-5xl sm:text-6xl text-white font-light leading-tight">
              The Lady Forge
            </h1>
            <p className="text-xs text-[#B0B0B0] font-light leading-relaxed max-w-md">
              Bespoke wedding dresses, cathedral bridal gowns, obsidian velvet gala gowns, and tailored silk suits crafted for individual elegance.
            </p>
          </div>
        </section>

        {/* Filter + Catalog */}
        <section className="py-14 bg-white dark:bg-[#050505] transition-colors duration-300">
          <Container size="wide">
            <div className="flex items-center justify-start flex-wrap gap-2 mb-12 border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-6">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setSelectedSubcategory(f.value)}
                  className={`px-5 py-2.5 text-xs font-sans uppercase tracking-[0.15em] transition-all border ${
                    selectedSubcategory === f.value
                      ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] border-[#050505] dark:border-white font-bold"
                      : "bg-white dark:bg-[#121212] text-[#555555] dark:text-[#A0A0A0] border-[#E5E5E5] dark:border-[#262626] hover:border-[#050505] dark:hover:border-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <span className="ml-auto text-xs text-[#8E8E93] dark:text-[#555555] uppercase tracking-wider">{filtered.length} pieces</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} onOpenFitDrawer={p => setSelectedProductForFit(p)} />
              ))}
            </div>
          </Container>
        </section>
      </main>

      <CustomFitDrawer product={selectedProductForFit} isOpen={!!selectedProductForFit} onClose={() => setSelectedProductForFit(null)} />
      <Footer />
    </div>
  );
}