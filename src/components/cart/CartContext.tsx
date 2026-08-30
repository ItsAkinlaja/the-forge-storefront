"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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
  addToCart: (
    product: Product,
    selectedSize?: string,
    bespokeMeasurements?: BespokeMeasurementData
  ) => void;
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

/** Map a server cart item to the local CartItem shape */
function serverItemToCartItem(item: ServerCartItem): CartItem {
  return {
    id: item.id,
    product: item.product,
    selectedSize: item.selectedSize,
    bespokeMeasurements: item.bespokeMeasurements ?? undefined,
    quantity: item.quantity,
  };
}

const LOCAL_STORAGE_KEY = "THE_FORGE_CART";

export function CartProvider({
  children,
  isAuthenticated = false,
  userId = null,
}: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Track previous auth state so we know when it changes
  const prevAuthRef = useRef<boolean>(isAuthenticated);
  const prevUserIdRef = useRef<number | null | undefined>(userId);

  // ------------------------------------------------------------------
  // Load cart on mount or when auth state changes
  // ------------------------------------------------------------------
  useEffect(() => {
    const authChanged =
      prevAuthRef.current !== isAuthenticated ||
      prevUserIdRef.current !== userId;

    prevAuthRef.current = isAuthenticated;
    prevUserIdRef.current = userId;

    if (isAuthenticated) {
      // Fetch from server
      fetchCart()
        .then((serverCart) => {
          setCart(serverCart.items.map(serverItemToCartItem));
        })
        .catch(() => {
          // If server fetch fails, keep local cart as fallback
          try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) setCart(JSON.parse(saved));
          } catch {}
        });
    } else if (authChanged && !isAuthenticated) {
      // User just logged out — clear cart
      setCart([]);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {}
    } else {
      // Not authenticated — load from localStorage
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) setCart(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to load cart from storage", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userId]);

  // ------------------------------------------------------------------
  // Sync to localStorage when not authenticated
  // ------------------------------------------------------------------
  useEffect(() => {
    if (isAuthenticated) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to save cart", e);
    }
  }, [cart, isAuthenticated]);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (
    product: Product,
    selectedSize?: string,
    bespokeMeasurements?: BespokeMeasurementData
  ) => {
    if (isAuthenticated) {
      addToServerCart(
        product.id,
        1,
        selectedSize,
        bespokeMeasurements
      )
        .then((serverCart) => {
          setCart(serverCart.items.map(serverItemToCartItem));
        })
        .catch((err) => console.warn("addToServerCart failed", err));
      setIsOpen(true);
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1 && !bespokeMeasurements) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          selectedSize:
            selectedSize || (product.isBespoke ? "Bespoke Custom Fit" : "Standard"),
          bespokeMeasurements,
          quantity: 1,
        };
        return [...prev, newItem];
      }
    });
    setIsOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    if (isAuthenticated) {
      removeServerCartItem(cartItemId)
        .then((serverCart) => {
          setCart(serverCart.items.map(serverItemToCartItem));
        })
        .catch((err) => console.warn("removeServerCartItem failed", err));
      return;
    }
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    if (isAuthenticated) {
      updateServerCartItem(cartItemId, quantity)
        .then((serverCart) => {
          setCart(serverCart.items.map(serverItemToCartItem));
        })
        .catch((err) => console.warn("updateServerCartItem failed", err));
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const formattedSubtotal = `₦${subtotal.toLocaleString("en-NG")}`;

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        subtotal,
        formattedSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
