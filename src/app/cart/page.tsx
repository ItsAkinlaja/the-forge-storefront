"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/components/cart/CartContext";
import { ShoppingBag, Trash2, Scissors, ShieldCheck, Minus, Plus, ArrowRight } from "lucide-react";

function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const itemCount = cart.reduce((t, i) => t + i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white">
        <Navbar />
        <main className="flex-1 py-20">
          <Container size="narrow">
            <div className="py-16 text-center space-y-8 max-w-md mx-auto">
              {/* Editorial empty bag SVG */}
              <svg
                viewBox="0 0 120 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-28 mx-auto"
                aria-hidden="true"
              >
                <rect x="20" y="40" width="80" height="90" rx="0" stroke="#E5E5E5" strokeWidth="2" />
                <path d="M40 40 C40 18 80 18 80 40" stroke="#E5E5E5" strokeWidth="2" fill="none" />
                <line x1="20" y1="60" x2="100" y2="60" stroke="#E5E5E5" strokeWidth="1" />
                <circle cx="60" cy="90" r="8" stroke="#C6A15B" strokeWidth="1.5" fill="none" />
                <line x1="56" y1="90" x2="64" y2="90" stroke="#C6A15B" strokeWidth="1.5" />
                <line x1="60" y1="86" x2="60" y2="94" stroke="#C6A15B" strokeWidth="1.5" />
              </svg>
              <div>
                <h1 className="font-editorial text-3xl text-[#050505] dark:text-white font-light mb-2">
                  Your Bag is Empty
                </h1>
                <p className="text-xs text-[#666666] dark:text-[#888888] leading-relaxed font-sans">
                  Browse The Men Forge and The Lady Forge collections.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Link href="/the-men-forge">
                  <Button variant="primary" size="sm">The Men Forge</Button>
                </Link>
                <Link href="/the-lady-forge">
                  <Button variant="gold" size="sm">The Lady Forge</Button>
                </Link>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white">
      <Navbar />

      <main className="flex-1 py-16">
        <Container size="wide">
          {/* Header */}
          <div className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-8 mb-12 flex flex-wrap justify-between items-end gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold font-sans">
                Your Selection
              </p>
              <h1 className="font-editorial text-4xl sm:text-5xl text-[#050505] dark:text-white font-light mt-1">
                Your Bag
              </h1>
            </div>
            <p className="text-xs text-[#888888] dark:text-[#555555] uppercase tracking-wider font-sans">
              {itemCount} {itemCount === 1 ? "Item" : "Items"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Item List */}
            <div className="lg:col-span-7 space-y-4">
              {cart.map((item) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="flex gap-5 p-5 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626]"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="relative w-24 h-32 bg-[#F5F5F5] dark:bg-[#121212] flex-shrink-0 overflow-hidden block"
                    >
                      <Image
                        src={item.product.images[0]?.src || "/images/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover object-top"
                        sizes="96px"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h3 className="font-editorial text-lg text-[#050505] dark:text-white leading-tight">
                              {item.product.name}
                            </h3>
                            <p className="text-[10px] text-[#C6A15B] uppercase tracking-wider mt-0.5 font-sans">
                              {item.product.subcategoryName}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#CCCCCC] dark:text-[#444444] hover:text-red-500 transition-colors p-1 flex-shrink-0"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-[#888888] dark:text-[#555555] mt-1.5 font-sans">
                          Size:{" "}
                          <span className="text-[#050505] dark:text-white">
                            {item.selectedSize}
                          </span>
                        </p>
                        <p className="text-xs text-[#888888] dark:text-[#555555] mt-0.5 font-sans">
                          Unit:{" "}
                          <span className="text-[#050505] dark:text-white">
                            {formatNGN(item.product.price)}
                          </span>
                        </p>

                        {item.bespokeMeasurements && (
                          <div className="mt-2 text-[10px] text-[#C6A15B] bg-[#FAFAF8] dark:bg-[#1A1813] border border-[#C6A15B]/20 dark:border-[#C6A15B]/10 px-2.5 py-1.5 flex items-center gap-1.5 font-sans">
                            <Scissors className="w-3 h-3" />
                            Custom fit data attached
                          </div>
                        )}
                      </div>

                      {/* Quantity + line total */}
                      <div className="flex items-center justify-between border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-3 mt-3">
                        <div className="flex items-center border border-[#E5E5E5] dark:border-[#262626]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center text-[#666666] dark:text-[#888888] hover:text-[#050505] dark:hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs text-[#050505] dark:text-white font-semibold font-sans">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center text-[#666666] dark:text-[#888888] hover:text-[#050505] dark:hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-editorial text-xl text-[#050505] dark:text-white">
                          {formatNGN(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 border border-[#E5E5E5] dark:border-[#262626] p-7 space-y-6 bg-white dark:bg-[#0A0A0A]">
              <h2 className="font-editorial text-2xl text-[#050505] dark:text-white font-light border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between text-[#666666] dark:text-[#888888]">
                  <span>Subtotal</span>
                  <span className="text-[#050505] dark:text-white font-medium">
                    {formatNGN(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#666666] dark:text-[#888888]">
                  <span>Delivery</span>
                  <span className="text-[#C6A15B]">Calculated at checkout</span>
                </div>
                <div className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-3 flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#050505] dark:text-white">
                    Total
                  </span>
                  <span className="font-editorial text-2xl text-[#050505] dark:text-white">
                    {formatNGN(subtotal)}
                  </span>
                </div>
              </div>

              {/* Promo code */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="promo-code"
                    placeholder="PROMO CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="uppercase tracking-widest text-[11px]"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {}}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              {/* CTA */}
              <Button
                variant="gold"
                size="lg"
                onClick={() => router.push("/checkout")}
                className="w-full flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Trust */}
              <div className="flex items-center gap-2 text-[10px] text-[#888888] dark:text-[#555555] font-sans pt-1">
                <ShieldCheck className="w-4 h-4 text-[#C6A15B] flex-shrink-0" />
                <span>Secured by Paystack 256-bit SSL</span>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
