"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Scissors, ArrowRight } from "lucide-react";
import { useCart } from "./CartContext";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, formattedSubtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#F9F8F6] dark:bg-[#0A0A0A] text-[#050505] dark:text-white border-l border-[#E2DFD7] dark:border-[#262626] z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#E2DFD7] dark:border-[#262626] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#B58A38] dark:text-[#C6A15B]" />
                <h2 className="font-editorial text-xl text-[#050505] dark:text-white tracking-wider uppercase">
                  Your Selection
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="text-[#646469] dark:text-[#8E8E93] hover:text-[#050505] dark:hover:text-white transition-colors p-2"
                aria-label="Close Shopping Bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#646469] dark:text-[#8E8E93] py-16">
                  <ShoppingBag className="w-12 h-12 stroke-[1] mb-4 text-[#CCCCCC] dark:text-[#262626]" />
                  <p className="font-editorial text-2xl text-[#050505] dark:text-white mb-2">Your Bag is Empty</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#646469] dark:text-[#8E8E93] max-w-xs mb-8">
                    Discover bespoke tailoring and haute couture collections for Men and Women.
                  </p>
                  <Button variant="gold" onClick={closeCart}>Explore Collections</Button>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white dark:bg-[#121212] border border-[#E2DFD7] dark:border-[#262626] relative group shadow-sm"
                  >
                    <div className="relative w-24 h-32 bg-[#F2F0EA] dark:bg-[#050505] flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.product.images[0]?.src || "/images/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-editorial text-lg text-[#050505] dark:text-white leading-snug">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#8E8E93] hover:text-[#FF453A] transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-[#B58A38] dark:text-[#C6A15B] tracking-wider uppercase mt-1">
                          {item.product.subcategoryName}
                        </p>

                        {item.selectedSize && (
                          <p className="text-xs text-[#555555] dark:text-[#8E8E93] mt-1">
                            Fit: <span className="text-[#050505] dark:text-white">{item.selectedSize}</span>
                          </p>
                        )}

                        {item.bespokeMeasurements && (
                          <div className="mt-2 text-[11px] text-[#B58A38] dark:text-[#C6A15B] bg-[#F5F2E9] dark:bg-[#1A1813] border border-[#E2DFD7] dark:border-[#382D12] p-2 flex items-center gap-1.5">
                            <Scissors className="w-3 h-3 flex-shrink-0" />
                            <span>Bespoke Custom Fitting Attached</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-[#E2DFD7] dark:border-[#262626] bg-[#F2F0EA] dark:bg-[#050505]">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1 text-xs text-[#646469] dark:text-[#8E8E93] hover:text-[#050505] dark:hover:text-white">-</button>
                          <span className="px-2.5 text-xs text-[#050505] dark:text-white font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 text-xs text-[#646469] dark:text-[#8E8E93] hover:text-[#050505] dark:hover:text-white">+</button>
                        </div>
                        <span className="font-editorial text-lg text-[#050505] dark:text-white">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#E2DFD7] dark:border-[#262626] bg-[#EFECE6] dark:bg-[#0C0C0C] space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#646469] dark:text-[#8E8E93] uppercase tracking-wider text-xs">Subtotal</span>
                  <span className="font-editorial text-2xl text-[#050505] dark:text-white">{formattedSubtotal}</span>
                </div>
                <p className="text-[11px] text-[#646469] dark:text-[#8E8E93] italic border-b border-[#D8D5CC] dark:border-[#1C1C1C] pb-3">
                  Complimentary global express shipping &amp; luxury garment presentation box included.
                </p>
                <Link href="/cart" onClick={closeCart} className="block">
                  <Button variant="gold" className="w-full py-4 flex items-center justify-center gap-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
