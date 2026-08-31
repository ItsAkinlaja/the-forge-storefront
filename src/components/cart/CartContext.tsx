"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, BespokeMeasurementData } from "@/types";
import {
  fetchCart,
  addToServerCart,
  updateServerCartItem,
  removeServerCartItem,
  ServerCartItem,
} from "@/lib/cart/service";

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, selectedSize?: string, bespokeMeasurements?: BespokeMeasurementData) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  cartCount: number;
  subtotal: number;
  formattedSubtotal: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  userId?: number | null;
}

function serverItemToCartItem(item: ServerCartItem): CartItem {
  return {
    id: item.id,
    product: item.product,
    selectedSize: item.selectedSize,
    bespokeMeasurements: item.bespokeMeasurements ?? undefined,
    quantity: item.quantity,
  };
}

export function CartProvider({ children, isAuthenticated = false, userId = null }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from server on mount and whenever auth state changes
  useEffect(() => {
    fetchCart()
      .then(sc => setCart(sc.items.map(serverItemToCartItem)))
      .catch(() => setCart([]));
  }, [isAuthenticated, userId]);

  const openCart  = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, selectedSize?: string, bespokeMeasurements?: BespokeMeasurementData) => {
    addToServerCart(product.id, 1, selectedSize, bespokeMeasurements)
      .then(sc => setCart(sc.items.map(serverItemToCartItem)))
      .catch(err => console.warn("addToServerCart failed", err));
    setIsOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    removeServerCartItem(cartItemId)
      .then(sc => setCart(sc.items.map(serverItemToCartItem)))
      .catch(err => console.warn("removeServerCartItem failed", err));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(cartItemId); return; }
    updateServerCartItem(cartItemId, quantity)
      .then(sc => setCart(sc.items.map(serverItemToCartItem)))
      .catch(err => console.warn("updateServerCartItem failed", err));
  };

  const cartCount        = cart.reduce((t, i) => t + i.quantity, 0);
  const subtotal         = cart.reduce((t, i) => t + i.product.price * i.quantity, 0);
  const formattedSubtotal = `\u20a6${subtotal.toLocaleString("en-NG")}`;

  return (
    <CartContext.Provider value={{ cart, isOpen, openCart, closeCart, addToCart, removeFromCart, updateQuantity, cartCount, subtotal, formattedSubtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
