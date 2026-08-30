"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { CustomFitDrawer } from "@/components/ecommerce/CustomFitDrawer";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

interface FeaturedSelectionProps {
  products: Product[];
}

export function FeaturedSelection({ products }: FeaturedSelectionProps) {
  const [selectedProductForFit, setSelectedProductForFit] = useState<Product | null>(null);

  return (
    <section className="py-24 bg-[#FFFFFF] dark:bg-[#050505] border-t border-[#E5E5E5] dark:border-[#1C1C1C] transition-colors duration-300">
      <Container size="wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0 border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold">
              CURATED MASTERPIECES
            </span>
            <Heading size="xl" className="mt-2 text-[#050505] dark:text-[#FFFFFF]">
              Featured Bespoke Creations
            </Heading>
          </div>
          <p className="text-xs text-[#555555] dark:text-[#8E8E93] max-w-sm">
            Handmade custom dressing tailored from mulberry silks, Mongolian cashmere, and 24K gold metallic thread.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenFitDrawer={p => setSelectedProductForFit(p)}
            />
          ))}
        </div>
      </Container>

      {/* Interactive Bespoke Fit Drawer */}
      <CustomFitDrawer
        product={selectedProductForFit}
        isOpen={!!selectedProductForFit}
        onClose={() => setSelectedProductForFit(null)}
      />
    </section>
  );
}
