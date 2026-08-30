"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { CustomFitDrawer } from "@/components/ecommerce/CustomFitDrawer";
import { wpClient } from "@/lib/wordpress/client";
import { Product } from "@/types";
import { Search as SearchIcon, X, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const inputRef     = useRef<HTMLInputElement>(null);

  const [query, setQuery]         = useState(searchParams.get("q") ?? "");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selectedProductForFit, setSelectedProductForFit] = useState<Product | null>(null);

  // Load all products once
  useEffect(() => {
    setLoading(true);
    wpClient.getProducts()
      .then(setAllProducts)
      .finally(() => setLoading(false));
  }, []);

  // Sync query to URL param
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    router.replace(`/search?${params.toString()}`, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const q = query.trim().toLowerCase();
  const results = q === ""
    ? allProducts
    : allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.subcategoryName.toLowerCase().includes(q) ||
        p.mainCategory.toLowerCase().includes(q)
      );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">

        {/* Search header */}
        <section className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] py-14 bg-white dark:bg-[#050505]">
          <Container size="default">
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="text-center space-y-2">
                <p className="text-[9px] uppercase tracking-[0.5em] text-[#C6A15B] font-semibold font-sans">Search</p>
                <h1 className="font-editorial text-4xl sm:text-5xl text-[#050505] dark:text-white font-light">
                  Find Your Look
                </h1>
              </div>

              {/* Search input -- font-size 16px prevents iOS auto-zoom */}
              <div className="relative">
                <input
                  ref={inputRef}
                  type="search"
                  autoComplete="off"
                  placeholder="Jalabiya, cargo pants, dinner dress..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{ fontSize: "16px" }}
                  className="w-full bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] pl-12 pr-12 py-4 text-[#050505] dark:text-white focus:outline-none focus:border-[#050505] dark:focus:border-white placeholder:text-[#BBBBBB] dark:placeholder:text-[#444444] rounded-none transition-colors"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C6A15B] flex-shrink-0" />
                {query && (
                  <button
                    onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#050505] dark:hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2">
                {["Jalabiya", "Cargo", "Blazer", "Dinner Dress", "2-Piece", "Danshiki"].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-sans border transition-all ${
                      query === tag
                        ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] border-[#050505] dark:border-white"
                        : "border-[#E5E5E5] dark:border-[#262626] text-[#888888] dark:text-[#555555] hover:border-[#050505] dark:hover:border-white hover:text-[#050505] dark:hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Results */}
        <section className="py-12 bg-white dark:bg-[#050505]">
          <Container size="wide">

            {/* Results count bar */}
            <div className="flex items-center justify-between mb-10 border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8E8E93] dark:text-[#555555] font-sans">
                {loading ? "Loading..." : `${results.length} ${results.length === 1 ? "result" : "results"}`}
              </span>
              {query && !loading && (
                <span className="text-[11px] text-[#555555] dark:text-[#8E8E93] font-sans">
                  For &ldquo;{query}&rdquo;
                </span>
              )}
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3 animate-pulse">
                    <div className="aspect-[3/4] bg-[#F5F5F5] dark:bg-[#111111]" />
                    <div className="h-3 bg-[#F5F5F5] dark:bg-[#111111] w-3/4" />
                    <div className="h-3 bg-[#F5F5F5] dark:bg-[#111111] w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {!loading && results.length === 0 && (
              <div className="py-20 text-center space-y-5 max-w-md mx-auto">
                <ShoppingBag className="w-12 h-12 text-[#CCCCCC] dark:text-[#262626] mx-auto stroke-[1]" />
                <h2 className="font-editorial text-2xl text-[#050505] dark:text-white font-light">
                  Nothing found for &ldquo;{query}&rdquo;
                </h2>
                <p className="text-xs text-[#888888] dark:text-[#555555] font-sans leading-relaxed">
                  Try a different word or browse our collections below.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Link href="/the-men-forge" className="px-6 py-3 bg-[#050505] dark:bg-white text-white dark:text-[#050505] text-[10px] uppercase tracking-[0.2em] font-sans font-semibold hover:bg-[#C6A15B] transition-colors">
                    The Men Forge
                  </Link>
                  <Link href="/the-lady-forge" className="px-6 py-3 border border-[#C6A15B] text-[#C6A15B] text-[10px] uppercase tracking-[0.2em] font-sans font-semibold hover:bg-[#C6A15B] hover:text-white transition-colors">
                    The Lady Forge
                  </Link>
                </div>
              </div>
            )}

            {/* Results grid */}
            {!loading && results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                {results.map(product => (
                  <ProductCard key={product.id} product={product} onOpenFitDrawer={p => setSelectedProductForFit(p)} />
                ))}
              </div>
            )}

          </Container>
        </section>
      </main>

      <CustomFitDrawer product={selectedProductForFit} isOpen={!!selectedProductForFit} onClose={() => setSelectedProductForFit(null)} />
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
