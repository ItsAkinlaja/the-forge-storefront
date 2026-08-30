"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Truck, ShieldCheck, MapPin, ChevronRight, ChevronDown, Scissors, Minus, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/components/cart/CartContext";
import { Button } from "@/components/ui/Button";
import { CustomFitDrawer } from "@/components/ecommerce/CustomFitDrawer";
import { ProductCard } from "@/components/ecommerce/ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[#E5E5E5] dark:border-[#1C1C1C]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-xs uppercase tracking-[0.2em] font-semibold font-sans text-[#050505] dark:text-white">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#888888] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-xs text-[#555555] dark:text-[#A0A0A0] leading-relaxed font-sans space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, openCart } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || "Bespoke Custom Fit"
  );
  const [quantity, setQuantity] = useState(1);
  const [fitDrawerOpen, setFitDrawerOpen] = useState(false);

  // Touch swipe state
  const touchStartX = useRef<number | null>(null);

  const currentImage =
    product.images[activeImageIndex]?.src ||
    product.images[0]?.src ||
    "/images/placeholder.jpg";

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // swipe left — next image
        setActiveImageIndex((prev) =>
          prev < product.images.length - 1 ? prev + 1 : 0
        );
      } else {
        // swipe right — prev image
        setActiveImageIndex((prev) =>
          prev > 0 ? prev - 1 : product.images.length - 1
        );
      }
    }
    touchStartX.current = null;
  };

  const handleAddToBag = useCallback(() => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    openCart();
  }, [addToCart, openCart, product, selectedSize, quantity]);

  const handleBuyNow = useCallback(() => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    router.push("/checkout");
  }, [addToCart, router, product, selectedSize, quantity]);

  const formattedPrice = `₦${product.price.toLocaleString("en-NG")}`;

  return (
    <div className="space-y-20 text-[#050505] dark:text-white">
      {/* Breadcrumb */}
      <nav
        className="text-xs uppercase tracking-[0.2em] text-[#646469] dark:text-[#8E8E93] flex items-center gap-2 flex-wrap"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-[#050505] dark:hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={product.mainCategory === "the-men-forge" ? "/the-men-forge" : "/the-lady-forge"}
          className="hover:text-[#050505] dark:hover:text-white transition-colors"
        >
          {product.mainCategory === "the-men-forge" ? "The Men Forge" : "The Lady Forge"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#C6A15B]">{product.name}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Image Gallery */}
        <div className="lg:col-span-7">
          {/* Mobile: main image full width with swipe */}
          <div
            className="relative aspect-[3/4] w-full bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={currentImage}
              alt={product.images[activeImageIndex]?.alt || product.name}
              fill
              priority
              className="object-cover object-top transition-opacity duration-500"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            {product.isBespoke && (
              <span className="absolute top-4 left-4 z-10 bg-[#050505]/80 dark:bg-[#050505]/90 border border-[#C6A15B]/40 text-[#C6A15B] text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-sm">
                <Scissors className="w-3.5 h-3.5" />
                Bespoke Handmade
              </span>
            )}
            {/* Dot indicators on mobile */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-1.5 h-1.5 transition-all ${
                      activeImageIndex === idx
                        ? "bg-[#C6A15B] w-4"
                        : "bg-white/50"
                    }`}
                    aria-label={`Image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail strip — below on mobile, hidden on mobile, left side on desktop via flex-row-reverse */}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 flex-shrink-0 border transition-all overflow-hidden ${
                    activeImageIndex === idx
                      ? "border-[#C6A15B]"
                      : "border-[#E5E5E5] dark:border-[#262626] opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-top"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-5 space-y-7 lg:sticky lg:top-28">
          {/* Category label + name + price */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C6A15B] font-semibold font-sans mb-2">
              {product.subcategoryName}
            </p>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#050505] dark:text-white font-normal leading-tight">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="mt-2 text-sm text-[#777777] dark:text-[#888888] font-editorial italic">
                {product.tagline}
              </p>
            )}
            <p className="mt-4 font-editorial text-2xl text-[#050505] dark:text-white font-light">
              {formattedPrice}
            </p>
          </div>

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] font-sans font-semibold">
                  Select Size
                </span>
                {product.isBespoke && (
                  <button
                    onClick={() => setFitDrawerOpen(true)}
                    className="text-[10px] uppercase tracking-wider text-[#C6A15B] underline hover:text-[#B5904B] transition-colors font-sans"
                  >
                    Custom Fit
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2.5 text-[11px] font-sans uppercase tracking-[0.15em] transition-all border ${
                      selectedSize === sz
                        ? "bg-[#050505] dark:bg-white text-white dark:text-[#050505] border-[#050505] dark:border-white font-bold"
                        : "bg-white dark:bg-[#121212] text-[#555555] dark:text-[#A0A0A0] border-[#E5E5E5] dark:border-[#262626] hover:border-[#888888]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bespoke CTA */}
          {product.isBespoke && (
            <button
              onClick={() => setFitDrawerOpen(true)}
              className="w-full flex items-center justify-between border border-[#C6A15B]/40 dark:border-[#C6A15B]/20 bg-[#C6A15B]/5 dark:bg-[#C6A15B]/5 px-4 py-3.5 text-left hover:border-[#C6A15B] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Scissors className="w-4 h-4 text-[#C6A15B]" />
                <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#050505] dark:text-white">
                  Request Custom Fit
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C6A15B] group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] font-sans font-semibold">
              Quantity
            </span>
            <div className="flex items-center border border-[#E5E5E5] dark:border-[#262626] w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-[#555555] dark:text-[#A0A0A0] hover:text-[#050505] dark:hover:text-white transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm text-[#050505] dark:text-white font-sans font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-[#555555] dark:text-[#A0A0A0] hover:text-[#050505] dark:hover:text-white transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="space-y-3">
            <Button
              variant="gold"
              size="lg"
              onClick={handleAddToBag}
              className="w-full"
            >
              Add to Bag
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleBuyNow}
              className="w-full"
            >
              Buy Now
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E5E5] dark:border-[#1C1C1C]">
            {[
              { Icon: Truck, label: "Free Delivery" },
              { Icon: ShieldCheck, label: "Secure Payment" },
              { Icon: MapPin, label: "Made in Lagos" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 py-3">
                <Icon className="w-4 h-4 text-[#C6A15B]" />
                <span className="text-[9px] uppercase tracking-wider text-[#888888] dark:text-[#555555] text-center font-sans">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Description + accordions */}
          <div className="space-y-0">
            <p className="text-xs text-[#555555] dark:text-[#A0A0A0] leading-relaxed font-sans pb-5 border-b border-[#E5E5E5] dark:border-[#1C1C1C]">
              {product.description}
            </p>

            {product.details && product.details.length > 0 && (
              <AccordionItem title="Product Details">
                <ul className="list-disc list-inside space-y-1">
                  {product.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </AccordionItem>
            )}

            {product.fabricCare && product.fabricCare.length > 0 && (
              <AccordionItem title="Fabric & Care">
                <ul className="list-disc list-inside space-y-1">
                  {product.fabricCare.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </AccordionItem>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-16 space-y-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C6A15B] font-semibold font-sans mb-2">
              You May Also Like
            </p>
            <h2 className="font-editorial text-3xl text-[#050505] dark:text-white">
              Related Pieces
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile sticky Add to Bag bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-[#E5E5E5] dark:border-[#1C1C1C] bg-white dark:bg-[#050505] p-4 flex gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={handleAddToBag}
          className="flex-1"
        >
          Add to Bag
        </Button>
        <Button
          variant="gold"
          size="md"
          onClick={handleBuyNow}
          className="flex-1"
        >
          Buy Now
        </Button>
      </div>

      <CustomFitDrawer
        product={product}
        isOpen={fitDrawerOpen}
        onClose={() => setFitDrawerOpen(false)}
      />
    </div>
  );
}
