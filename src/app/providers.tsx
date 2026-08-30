"use client";

import React, { useState, useCallback } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ThemeProvider } from "@/components/theme/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    userId: number | null;
  }>({ isAuthenticated: false, userId: null });

  const handleLogin = useCallback((userId: number) => {
    setAuthState({ isAuthenticated: true, userId });
  }, []);

  const handleLogout = useCallback(() => {
    setAuthState({ isAuthenticated: false, userId: null });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider onLogin={handleLogin} onLogout={handleLogout}>
        <CartProvider
          isAuthenticated={authState.isAuthenticated}
          userId={authState.userId}
        >
          {children}
          <CartDrawer />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
