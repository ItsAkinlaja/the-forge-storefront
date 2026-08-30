"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { CustomFitDrawer } from "@/components/ecommerce/CustomFitDrawer";
import { wpClient } from "@/lib/wordpress/client";
import { Product, MenSubcategory } from "@/types";

const FILTERS: { label: string; value: MenSubcategory | "all" }[] = [
  { label: "All",            value: "all"            },
  { label: "Vintage Shirts", value: "vintage-shirts" },
  { label: "Streetwear",     value: "streetwear"     },
  { label: "Pants",          value: "pants"          },
  { label: "2-Piece",        value: "two-piece"      },
  { label: "Jalabias",       value: "jalabias"       },
  { label: "Danshiki",       value: "danshiki"       },
  { label: "Caps",           value: "caps"           },
];

export default function MenForgePage() {
  const [products, setProducts]                       = useState<Product[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<MenSubcategory | "all">("all");
  const [selectedProductForFit, setSelectedProductForFit] = useState<Product | null>(null);

  useEffect(() => {
    wpClient.getProducts({ mainCategory: "the-men-forge" }).then(setProducts);
  }, []);

  const filtered = selectedSubcategory === "all"
    ? products
    : products.filter(p => p.subcategory === selectedSubcategory);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1">

        <section className="relative h-[50vh] min-h-[380px] w-full flex items-end justify-start overflow-hidden border-b border-[#E5E5E5] dark:border-[#1C1C1C]">
          <Image
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=85"
            alt="The Men Forge"
            fill priority
            className="object-cover object-center brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
          <div className="relative z-10 px-8 sm:px-16 pb-12 sm:pb-16 space-y-3 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#C6A15B] font-semibold">
              Vintage. Streetwear. Culture. Lagos.
            </p>
            <h1 className="font-editorial text-5xl sm:text-6xl text-white font-light leading-tight">
              The Men Forge
            </h1>
            <p className="text-xs text-[#B0B0B0] font-light leading-relaxed max-w-md">
              Premium shirts, cargo pants, joggers, jalabias, danshikis, caps, and 2-piece sets -- crafted for the Nigerian man who does not compromise.
            </p>
          </div>
        </section>

        <section className="py-14 bg-white dark:bg-[#050505]">
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