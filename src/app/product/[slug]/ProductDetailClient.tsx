"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Scissors, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/components/cart/CartContext";
import { Button } from "@/components/ui/Button";
import { CustomFitDrawer } from "@/components/ecommerce/CustomFitDrawer";
import { ProductCard } from "@/components/ecommerce/ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || "Bespoke Custom Fit");
  const [fitDrawerOpen, setFitDrawerOpen] = useState(false);

  const { addToCart } = useCart();
  const currentImage = product.images[activeImageIndex]?.src || product.images[0]?.src || "/images/placeholder.jpg";

  return (
    <div className="space-y-20 bg-[#F9F8F6] dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <nav className="text-xs uppercase tracking-[0.2em] text-[#646469] dark:text-[#8E8E93] flex items-center gap-2">
        <Link href="/" className="hover:text-[#050505] dark:hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#888888] dark:text-[#555555]" />
        <Link href={product.mainCategory === "the-men-forge" ? "/the-men-forge" : "/the-lady-forge"} className="hover:text-[#050505] dark:hover:text-white">
          {product.mainCategory === "the-men-forge" ? "The Men Forge" : "The Lady Forge"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#888888] dark:text-[#555555]" />
        <span className="text-[#B58A38] dark:text-[#C6A15B]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
          <div className="relative aspect-[3/4] w-full bg-white dark:bg-[#0A0A0A] border border-[#E2DFD7] dark:border-[#262626] overflow-hidden group shadow-md">
            <Image src={currentImage} alt={product.name} fill priority className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            {product.isBespoke && (
              <span className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-[#1A1813] border border-[#B58A38]/30 dark:border-[#382D12] text-[#B58A38] dark:text-[#C6A15B] text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                <Scissors className="w-3.5 h-3.5" />
                Handmade Bespoke Tailoring
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] flex-shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 bg-white dark:bg-[#0A0A0A] border transition-all flex-shrink-0 ${
                    activeImageIndex === idx ? "border-[#B58A38] dark:border-[#C6A15B] scale-105" : "border-[#E2DFD7] dark:border-[#262626] opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-8 sticky top-28">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B58A38] dark:text-[#C6A15B] font-semibold mb-2">
              <span>{product.subcategoryName}</span>
              <span>and</span>
              <span className="text-[#646469] dark:text-[#8E8E93]">Atelier Masterpiece</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl text-[#050505] dark:text-white font-normal leading-tight">{product.name}</h1>
            {product.tagline && <p className="text-sm text-[#555555] dark:text-[#A0A0A0] font-light mt-2 italic font-editorial">{product.tagline}</p>}
            <div className="mt-4 text-2xl font-editorial text-[#050505] dark:text-white font-light">{product.formattedPrice}</div>
          </div>

          <div className="bg-white dark:bg-[#121212] border border-[#E2DFD7] dark:border-[#262626] p-5 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#B58A38] dark:text-[#C6A15B] font-bold">
              <Scissors className="w-4 h-4" />
              <span>Bespoke Measurement Guarantee</span>
            </div>
            <p className="text-xs text-[#555555] dark:text-[#A0A0A0] leading-relaxed font-light">
              This garment is individually drafted and cut by hand in our Lagos and Paris ateliers. Submit your exact body measurements for a custom fit pattern or choose a standard size.
            </p>
            <Button variant="gold" size="md" onClick={() => setFitDrawerOpen(true)} className="w-full py-3.5 flex items-center justify-center gap-2">
              <Scissors className="w-4 h-4" />
              <span>INPUT BESPOKE FIT MEASUREMENTS</span>
            </Button>
          </div>

          {product.sizes && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs uppercase tracking-[0.15em] text-[#646469] dark:text-[#8E8E93]">
                <span>Select Standard Fit</span>
                <button onClick={() => setFitDrawerOpen(true)} className="text-[#B58A38] dark:text-[#C6A15B] underline hover:text-[#050505] dark:hover:text-white">Custom Fit Option</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2.5 text-xs font-sans uppercase tracking-[0.15em] transition-all border ${
                      selectedSize === sz
                        ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] border-[#050505] dark:border-white font-bold"
                        : "bg-white dark:bg-[#121212] text-[#555555] dark:text-[#A0A0A0] border-[#E2DFD7] dark:border-[#262626] hover:border-[#888888]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button variant="primary" size="lg" onClick={() => addToCart(product, selectedSize)} className="w-full py-4">
              ADD TO SELECTION
            </Button>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-[#646469] dark:text-[#8E8E93] uppercase tracking-wider pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#B58A38] dark:text-[#C6A15B]" />
                <span>Complimentary Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B58A38] dark:text-[#C6A15B]" />
                <span>Atelier Certificate of Authenticity</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E2DFD7] dark:border-[#1C1C1C] pt-6 space-y-4 text-xs text-[#555555] dark:text-[#A0A0A0] leading-relaxed">
            <p>{product.description}</p>
            {product.details && (
              <div className="space-y-2 pt-2">
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#050505] dark:text-white font-semibold">Garment Construction Details</h4>
                <ul className="list-disc list-inside space-y-1 text-[#646469] dark:text-[#8E8E93]">
                  {product.details.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="border-t border-[#E2DFD7] dark:border-[#1C1C1C] pt-16 space-y-8">
          <div className="flex justify-between items-end border-b border-[#E2DFD7] dark:border-[#1C1C1C] pb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#B58A38] dark:text-[#C6A15B] font-semibold">RECOMMENDED SELECTION</span>
              <h2 className="font-editorial text-3xl text-[#050505] dark:text-white mt-1">You May Also Admire</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.slice(0, 3).map(rel => <ProductCard key={rel.id} product={rel} />)}
          </div>
        </div>
      )}

      <CustomFitDrawer product={product} isOpen={fitDrawerOpen} onClose={() => setFitDrawerOpen(false)} />
    </div>
  );
}