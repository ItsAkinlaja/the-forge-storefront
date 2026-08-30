"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { CustomFitDrawer } from "@/components/ecommerce/CustomFitDrawer";
import { wpClient } from "@/lib/wordpress/client";
import { Product } from "@/types";
import { Search as SearchIcon, X } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductForFit, setSelectedProductForFit] = useState<Product | null>(null);

  useEffect(() => {
    wpClient.getProducts().then(setAllProducts);
  }, []);

  const results = query.trim() === ""
    ? allProducts
    : allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategoryName.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Search header */}
        <section className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] py-16 bg-white dark:bg-[#050505]">
          <Container size="default">
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-[10px] uppercase tracking-[0.45em] text-[#C6A15B] font-semibold text-center">Atelier Search</p>
              <h1 className="font-editorial text-4xl sm:text-5xl text-[#050505] dark:text-white font-light text-center">
                Search The Forge Catalog
              </h1>
              <div className="relative mt-4">
                <input
                  type="text"
                  autoFocus
                  placeholder="Jalamia, Tuxedo, Wedding Dress, Coat..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] pl-12 pr-10 py-4 text-sm text-[#050505] dark:text-white focus:outline-none focus:border-[#050505] dark:focus:border-white placeholder:text-[#AAAAAA] dark:placeholder:text-[#555555]"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C6A15B]" />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#050505] dark:hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* Results */}
        <section className="py-14 bg-white dark:bg-[#050505]">
          <Container size="wide">
            <div className="flex justify-between items-center mb-10 border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8E8E93] dark:text-[#555555]">
                {results.length} {results.length === 1 ? "result" : "results"}
              </span>
              {query && (
                <span className="text-xs text-[#555555] dark:text-[#8E8E93]">
                  For &ldquo;{query}&rdquo;
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map(product => (
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