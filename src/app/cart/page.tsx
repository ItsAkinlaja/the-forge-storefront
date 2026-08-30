"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartContext";
import { ShoppingBag, Trash2, Scissors, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, formattedSubtotal } = useCart();
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutComplete(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-16">
        <Container size="wide">
          {/* Header */}
          <div className="border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-8 mb-12 flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#C6A15B] font-semibold">Your Selection</p>
              <h1 className="font-editorial text-4xl sm:text-5xl text-[#050505] dark:text-white font-light mt-1">Shopping Bag</h1>
            </div>
            <p className="text-xs text-[#8E8E93] dark:text-[#555555] uppercase tracking-wider">
              {cart.length} {cart.length === 1 ? "Item" : "Items"}
            </p>
          </div>

          {checkoutComplete ? (
            <div className="max-w-2xl mx-auto text-center py-20 space-y-6 border border-[#E5E5E5] dark:border-[#262626] p-12">
              <CheckCircle className="w-16 h-16 text-[#C6A15B] mx-auto stroke-[1]" />
              <h2 className="font-editorial text-3xl text-[#050505] dark:text-white font-light">Order Request Placed</h2>
              <p className="text-xs text-[#555555] dark:text-[#A0A0A0] leading-relaxed max-w-md mx-auto">
                Thank you for selecting THE FORGE. Your order for <span className="text-[#C6A15B] font-semibold">{formattedSubtotal}</span> has been sent to our master atelier. A senior concierge will contact you to finalise bespoke fitting and shipping.
              </p>
              <Link href="/"><Button variant="gold" size="md">Return to Homepage</Button></Link>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-20 text-center space-y-6 max-w-md mx-auto">
              <ShoppingBag className="w-14 h-14 text-[#CCCCCC] dark:text-[#262626] mx-auto stroke-[1]" />
              <h2 className="font-editorial text-3xl text-[#050505] dark:text-white font-light">Your Bag is Empty</h2>
              <p className="text-xs text-[#666666] dark:text-[#8E8E93] leading-relaxed">
                Discover handmade bespoke suits, Jalamias, and couture bridal dresses from The Men Forge and The Lady Forge.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link href="/the-men-forge"><Button variant="primary" size="sm">The Men Forge</Button></Link>
                <Link href="/the-lady-forge"><Button variant="gold" size="sm">The Lady Forge</Button></Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Items */}
              <div className="lg:col-span-7 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-5 p-5 bg-white dark:bg-[#0A0A0A] border border-[#E5E5E5] dark:border-[#262626]">
                    <div className="relative w-24 h-32 bg-[#F5F5F5] dark:bg-[#121212] flex-shrink-0 overflow-hidden">
                      <Image src={item.product.images[0]?.src || "/images/placeholder.jpg"} alt={item.product.name} fill className="object-cover object-top" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-editorial text-xl text-[#050505] dark:text-white">{item.product.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-[#CCCCCC] dark:text-[#555555] hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#C6A15B] uppercase tracking-wider mt-1">{item.product.subcategoryName}</p>
                        <p className="text-xs text-[#888888] dark:text-[#555555] mt-1">Fit: <span className="text-[#050505] dark:text-white">{item.selectedSize}</span></p>
                        {item.bespokeMeasurements && (
                          <div className="mt-2 text-[11px] text-[#C6A15B] bg-[#FAFAF8] dark:bg-[#1A1813] border border-[#E5E5E5] dark:border-[#382D12] p-2 flex items-center gap-1.5">
                            <Scissors className="w-3 h-3" />
                            Bespoke Fit Data Attached
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-3 mt-3">
                        <div className="flex items-center border border-[#E5E5E5] dark:border-[#262626]">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-sm text-[#666666] dark:text-[#8E8E93] hover:text-[#050505] dark:hover:text-white">-</button>
                          <span className="px-3 text-xs text-[#050505] dark:text-white font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-sm text-[#666666] dark:text-[#8E8E93] hover:text-[#050505] dark:hover:text-white">+</button>
                        </div>
                        <span className="font-editorial text-xl text-[#050505] dark:text-white">${(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-5 border border-[#E5E5E5] dark:border-[#262626] p-8 space-y-6 sticky top-28">
                <h3 className="font-editorial text-2xl text-[#050505] dark:text-white border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-4 font-light">Order Summary</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#666666] dark:text-[#8E8E93]">
                    <span>Subtotal</span>
                    <span className="text-[#050505] dark:text-white">{formattedSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#666666] dark:text-[#8E8E93]">
                    <span>Global Express Shipping</span>
                    <span className="text-[#C6A15B]">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-[#666666] dark:text-[#8E8E93]">
                    <span>Atelier Presentation Box</span>
                    <span className="text-[#C6A15B]">Included</span>
                  </div>
                  <div className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-3 flex justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#050505] dark:text-white">Total</span>
                    <span className="font-editorial text-2xl text-[#C6A15B]">{formattedSubtotal}</span>
                  </div>
                </div>
                <form onSubmit={handleCheckout} className="space-y-3 pt-2">
                  <input
                    type="email"
                    required
                    placeholder="EMAIL FOR ORDER CONCIERGE"
                    className="w-full bg-[#F9F9F9] dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] p-3.5 text-xs text-[#050505] dark:text-white focus:outline-none focus:border-[#050505] dark:focus:border-white placeholder:text-[#AAAAAA]"
                  />
                  <Button variant="gold" size="lg" className="w-full py-4 flex items-center justify-center gap-2">
                    Place Order Request <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
                <div className="pt-2 text-[11px] text-[#888888] dark:text-[#555555] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C6A15B] flex-shrink-0" />
                  Encrypted 256-Bit SSL Checkout
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}