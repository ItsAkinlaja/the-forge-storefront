"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { AuthUser, getMe, login as authLogin, register as authRegister, logout as authLogout } from "@/lib/auth/service";
import { getGuestToken, clearGuestToken } from "@/lib/cart/guestToken";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  onLogin?: (userId: number) => void;
  onLogout?: () => void;
}

export function AuthProvider({ children, onLogin, onLogout }: AuthProviderProps) {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const onLoginRef  = useRef(onLogin);
  const onLogoutRef = useRef(onLogout);
  useEffect(() => { onLoginRef.current  = onLogin;  }, [onLogin]);
  useEffect(() => { onLogoutRef.current = onLogout; }, [onLogout]);

  const refreshUser = useCallback(async () => {
    const me = await getMe();
    setUser(me);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setIsLoading(true);
      try {
        const me = await getMe();
        if (!cancelled) {
          setUser(me);
          if (me) onLoginRef.current?.(me.id);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Grab guest token before login so we can merge the guest cart
    const guestToken = getGuestToken();
    const result = await authLogin(email, password, guestToken || undefined);
    setUser(result.user);
    clearGuestToken();
    onLoginRef.current?.(result.user.id);
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    const guestToken = getGuestToken();
    const result = await authRegister(email, password, firstName, lastName, guestToken || undefined);
    setUser(result.user);
    clearGuestToken();
    onLoginRef.current?.(result.user.id);
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    onLogoutRef.current?.();
  }, []);

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
