"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Scissors, ArrowUpRight } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/components/cart/CartContext";

interface ProductCardProps {
  product: Product;
  onOpenFitDrawer?: (product: Product) => void;
}

export function ProductCard({ product, onOpenFitDrawer }: ProductCardProps) {
  const { addToCart } = useCart();
  const primaryImage = product.images[0]?.src || "/images/placeholder.jpg";
  const hoverImage = product.images[1]?.src || primaryImage;

  return (
    <div className="group relative bg-white dark:bg-[#0A0A0A] border border-[#E2DFD7] dark:border-[#1C1C1C] flex flex-col justify-between transition-all duration-500 hover:border-[#B58A38] dark:hover:border-[#C6A15B] shadow-sm hover:shadow-xl">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2F0EA] dark:bg-[#050505]">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isBespoke && (
            <span className="bg-white/90 dark:bg-[#1A1813] border border-[#B58A38]/30 dark:border-[#382D12] text-[#B58A38] dark:text-[#C6A15B] text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 flex items-center gap-1 backdrop-blur-sm shadow-sm">
              <Scissors className="w-3 h-3" />
              Bespoke Handmade
            </span>
          )}
          {product.featured && (
            <span className="bg-[#050505] border border-[#262626] text-white text-[9px] uppercase tracking-[0.2em] px-2.5 py-1">
              Masterpiece
            </span>
          )}
        </div>

        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover object-top transition-opacity duration-700 group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Image
            src={hoverImage}
            alt={`${product.name} alternate view`}
            fill
            className="object-cover object-top opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Quick Action Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#050505]/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2">
          {product.isBespoke && onOpenFitDrawer ? (
            <button
              onClick={() => onOpenFitDrawer(product)}
              className="flex-1 bg-[#B58A38] dark:bg-[#C6A15B] text-white dark:text-[#050505] text-[10px] uppercase font-bold tracking-[0.15em] py-2.5 px-3 hover:bg-[#99722A] dark:hover:bg-[#B5904B] transition-colors flex items-center justify-center gap-1 shadow-md"
            >
              <Scissors className="w-3.5 h-3.5" />
              Custom Fit Drawer
            </button>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-[#050505] dark:bg-white text-white dark:text-[#050505] text-[10px] uppercase font-bold tracking-[0.15em] py-2.5 px-3 hover:bg-[#B58A38] hover:text-white transition-colors"
            >
              Add to Selection
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-2 border-t border-[#E2DFD7] dark:border-[#1C1C1C] bg-white dark:bg-[#0A0A0A]">
        <div className="flex items-center justify-between text-[10px] text-[#B58A38] dark:text-[#C6A15B] uppercase tracking-[0.2em] font-semibold">
          <span>{product.subcategoryName}</span>
          <span className="text-[#646469] dark:text-[#8E8E93]">
            {product.mainCategory === "the-men-forge" ? "The Men Forge" : "The Lady Forge"}
          </span>
        </div>

        <Link href={`/product/${product.slug}`} className="block group-hover:text-[#B58A38] dark:group-hover:text-[#C6A15B] transition-colors">
          <h3 className="font-editorial text-xl text-[#050505] dark:text-white font-normal leading-snug flex items-center justify-between">
            <span>{product.name}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#B58A38] dark:text-[#C6A15B]" />
          </h3>
        </Link>

        <div className="flex items-center justify-between pt-1">
          <span className="font-editorial text-lg text-[#050505] dark:text-white font-light">
            {product.formattedPrice}
          </span>
          <span className="text-[10px] text-[#646469] dark:text-[#8E8E93] uppercase tracking-wider">
            {product.isBespoke ? "Hand-sculpted" : "Ready-to-wear"}
          </span>
        </div>
      </div>
    </div>
  );
}
