"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, ChevronDown, Scissors, User, ChevronRight, ArrowUpRight } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const LOGO_DARK    = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4179-e1788079593872.jpg";
const LOGO_LIGHT   = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4180.JPG-e1788097102902-removebg-preview.png";
const LOGO_PNG     = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4180.JPG-e1788097102902-removebg-preview.png";

interface NavbarProps {
  overlay?: boolean;
}

export function Navbar({ overlay = false }: NavbarProps) {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menOpen, setMenOpen]               = useState(false);
  const [ladyOpen, setLadyOpen]             = useState(false);
  const [accountOpen, setAccountOpen]       = useState(false);
  const [drawerMenOpen, setDrawerMenOpen]   = useState(false);
  const [drawerLadyOpen, setDrawerLadyOpen] = useState(false);
  const accountRef                          = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router   = useRouter();
  const { openCart, cartCount } = useCart();
  const { theme }               = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const isTransparent = overlay && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  async function handleSignOut() {
    setAccountOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push("/");
  }

  function closeDrawer() {
    setMobileMenuOpen(false);
    setDrawerMenOpen(false);
    setDrawerLadyOpen(false);
  }

  const logoSrc     = theme === "dark" ? LOGO_DARK : LOGO_LIGHT;
  const textColor   = isTransparent ? "text-white" : "text-[#050505] dark:text-[#D0D0D0]";
  const goldHover   = "hover:text-[#C6A15B]";

  return (
    <>
      {/* â”€â”€ Main header â”€â”€ */}
      <header
        className={`${overlay ? "absolute left-0 right-0 z-50" : "sticky top-0 z-50"} transition-all duration-300 ${
          isTransparent
            ? "bg-transparent py-4"
            : "bg-white/96 dark:bg-[#050505]/96 backdrop-blur-md shadow-sm border-b border-[#EBEBEB] dark:border-[#181818] py-3 sticky top-0"
        }`}
      >
        <Container size="wide" className="flex items-center gap-8">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative h-10 w-28 sm:h-12 sm:w-36">
              <Image
                key={`${logoSrc}-${isTransparent}`}
                src={isTransparent ? LOGO_PNG : logoSrc}
                alt="THE FORGE"
                fill
                priority
                className="object-contain object-left transition-opacity duration-300"
                sizes="(max-width: 640px) 112px, 144px"
              />
            </div>
          </Link>

          <div className="flex-1 hidden lg:block" />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 text-[11px] tracking-[0.18em] uppercase font-sans">

            <div className="relative py-2 group" onMouseEnter={() => setMenOpen(true)} onMouseLeave={() => setMenOpen(false)}>
              <Link href="/the-men-forge" className={`flex items-center gap-1 transition-colors ${pathname?.startsWith("/the-men-forge") ? "text-[#C6A15B]" : `${textColor} ${goldHover}`}`}>
                The Men Forge
                <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
              </Link>
              {menOpen && (
                <div className="absolute top-full right-0 w-56 bg-white dark:bg-[#0A0A0A] border border-[#EBEBEB] dark:border-[#1C1C1C] py-3 shadow-xl z-50">
                  <p className="text-[9px] text-[#C6A15B] uppercase tracking-[0.25em] font-semibold px-4 pb-2 border-b border-[#EBEBEB] dark:border-[#1C1C1C]">Men Bespoke</p>
                  <Link href="/the-men-forge/suits-blazers" className="block px-4 py-2.5 text-[11px] text-[#555] dark:text-[#A0A0A0] hover:text-[#050505] dark:hover:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#111] transition-all">Suits and Tuxedos</Link>
                  <Link href="/the-men-forge/jalamia-kaftans" className="block px-4 py-2.5 text-[11px] text-[#555] dark:text-[#A0A0A0] hover:text-[#050505] dark:hover:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#111] transition-all">Jalamias and Kaftans</Link>
                  <Link href="/the-men-forge/luxury-coats" className="block px-4 py-2.5 text-[11px] text-[#555] dark:text-[#A0A0A0] hover:text-[#050505] dark:hover:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#111] transition-all">Luxury Coats</Link>
                </div>
              )}
            </div>

            <div className="relative py-2 group" onMouseEnter={() => setLadyOpen(true)} onMouseLeave={() => setLadyOpen(false)}>
              <Link href="/the-lady-forge" className={`flex items-center gap-1 transition-colors ${pathname?.startsWith("/the-lady-forge") ? "text-[#C6A15B]" : `${textColor} ${goldHover}`}`}>
                The Lady Forge
                <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
              </Link>
              {ladyOpen && (
                <div className="absolute top-full right-0 w-56 bg-white dark:bg-[#0A0A0A] border border-[#EBEBEB] dark:border-[#1C1C1C] py-3 shadow-xl z-50">
                  <p className="text-[9px] text-[#C6A15B] uppercase tracking-[0.25em] font-semibold px-4 pb-2 border-b border-[#EBEBEB] dark:border-[#1C1C1C]">Lady Couture</p>
                  <Link href="/the-lady-forge/wedding-dresses" className="block px-4 py-2.5 text-[11px] text-[#555] dark:text-[#A0A0A0] hover:text-[#050505] dark:hover:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#111] transition-all">Wedding and Bridal</Link>
                  <Link href="/the-lady-forge/couture-gowns" className="block px-4 py-2.5 text-[11px] text-[#555] dark:text-[#A0A0A0] hover:text-[#050505] dark:hover:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#111] transition-all">Couture Gala Gowns</Link>
                  <Link href="/the-lady-forge/tailored-suits" className="block px-4 py-2.5 text-[11px] text-[#555] dark:text-[#A0A0A0] hover:text-[#050505] dark:hover:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#111] transition-all">Tailored Suits</Link>
                </div>
              )}
            </div>

            <Link href="/custom-dressing" className={`flex items-center gap-1.5 transition-colors ${textColor} ${goldHover}`}>
              <Scissors className="w-3 h-3 text-[#C6A15B]" />
              Bespoke
            </Link>

            <Link href="/editorial" className={`transition-colors ${textColor} ${goldHover}`}>
              Lookbook
            </Link>

            <div className={`w-px h-4 ${isTransparent ? "bg-white/20" : "bg-[#E0E0E0] dark:bg-[#2A2A2A]"}`} />

            <ThemeToggle />

            <Link href="/search" className={`transition-colors ${textColor} ${goldHover}`} aria-label="Search">
              <Search className="w-4 h-4 stroke-[1.5]" />
            </Link>

            {isAuthenticated && user ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center justify-center w-7 h-7 border border-[#C6A15B] text-[#C6A15B] text-[10px] font-bold font-sans hover:bg-[#C6A15B] hover:text-white transition-all"
                  aria-label="Account menu"
                >
                  {user.firstName.charAt(0).toUpperCase()}
                </button>
                {accountOpen && (
                  <div className="absolute top-full right-0 w-44 bg-white dark:bg-[#0A0A0A] border border-[#EBEBEB] dark:border-[#1C1C1C] py-2 shadow-xl z-50 mt-1">
                    <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-[11px] text-[#555] dark:text-[#A0A0A0] hover:text-[#050505] dark:hover:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#111] transition-all tracking-[0.1em] uppercase font-sans">My Account</Link>
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2.5 text-[11px] text-[#555] dark:text-[#A0A0A0] hover:text-[#050505] dark:hover:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#111] transition-all tracking-[0.1em] uppercase font-sans">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={`transition-colors ${textColor} ${goldHover}`} aria-label="Sign in">
                <User className="w-4 h-4 stroke-[1.5]" />
              </Link>
            )}

            <button onClick={openCart} className={`transition-colors relative ${textColor} ${goldHover}`} aria-label="Bag">
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#C6A15B] text-white text-[8px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>
          </nav>

          {/* Mobile icons */}
          <div className="lg:hidden flex items-center gap-4 ml-auto">
            <button onClick={openCart} className={`relative p-1 ${textColor}`} aria-label="Bag">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C6A15B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-1 ${textColor}`}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </Container>
      </header>

      {/* â”€â”€ Mobile drawer overlay â”€â”€ */}
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Drawer panel -- slides from right */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-[85vw] max-w-[360px] z-[80] lg:hidden flex flex-col bg-white dark:bg-[#050505] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEBEB] dark:border-[#181818] flex-shrink-0">
          <div className="relative h-9 w-24">
            <Image src={logoSrc} alt="THE FORGE" fill className="object-contain object-left" />
          </div>
          <button
            onClick={closeDrawer}
            className="w-8 h-8 flex items-center justify-center text-[#888888] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* Main links */}
          <div className="px-6 pt-6 space-y-1">

            {/* Men Forge accordion */}
            <div>
              <button
                onClick={() => setDrawerMenOpen((v) => !v)}
                className="w-full flex items-center justify-between py-3.5 border-b border-[#F0F0F0] dark:border-[#141414]"
              >
                <span className="font-editorial text-xl text-[#050505] dark:text-white font-light tracking-wide">The Men Forge</span>
                <ChevronRight className={`w-4 h-4 text-[#C6A15B] transition-transform duration-200 ${drawerMenOpen ? "rotate-90" : ""}`} />
              </button>
              {drawerMenOpen && (
                <div className="py-2 pl-4 space-y-1">
                  {[
                    { href: "/the-men-forge", label: "All Collections" },
                    { href: "/the-men-forge/suits-blazers", label: "Suits and Tuxedos" },
                    { href: "/the-men-forge/jalamia-kaftans", label: "Jalamias and Kaftans" },
                    { href: "/the-men-forge/luxury-coats", label: "Luxury Coats" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeDrawer}
                      className="flex items-center justify-between py-2.5 text-[11px] uppercase tracking-[0.2em] text-[#555555] dark:text-[#888888] hover:text-[#C6A15B] transition-colors font-sans"
                    >
                      {item.label}
                      <ArrowUpRight className="w-3 h-3 opacity-40" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Lady Forge accordion */}
            <div>
              <button
                onClick={() => setDrawerLadyOpen((v) => !v)}
                className="w-full flex items-center justify-between py-3.5 border-b border-[#F0F0F0] dark:border-[#141414]"
              >
                <span className="font-editorial text-xl text-[#050505] dark:text-white font-light tracking-wide">The Lady Forge</span>
                <ChevronRight className={`w-4 h-4 text-[#C6A15B] transition-transform duration-200 ${drawerLadyOpen ? "rotate-90" : ""}`} />
              </button>
              {drawerLadyOpen && (
                <div className="py-2 pl-4 space-y-1">
                  {[
                    { href: "/the-lady-forge", label: "All Collections" },
                    { href: "/the-lady-forge/wedding-dresses", label: "Wedding and Bridal" },
                    { href: "/the-lady-forge/couture-gowns", label: "Couture Gala Gowns" },
                    { href: "/the-lady-forge/tailored-suits", label: "Tailored Suits" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeDrawer}
                      className="flex items-center justify-between py-2.5 text-[11px] uppercase tracking-[0.2em] text-[#555555] dark:text-[#888888] hover:text-[#C6A15B] transition-colors font-sans"
                    >
                      {item.label}
                      <ArrowUpRight className="w-3 h-3 opacity-40" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Standalone links */}
            {[
              { href: "/custom-dressing", label: "Bespoke Fitting", accent: true },
              { href: "/editorial", label: "Lookbook", accent: false },
              { href: "/search", label: "Search", accent: false },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeDrawer}
                className={`flex items-center justify-between py-3.5 border-b border-[#F0F0F0] dark:border-[#141414] text-[11px] uppercase tracking-[0.2em] font-sans transition-colors ${item.accent ? "text-[#C6A15B]" : "text-[#050505] dark:text-[#D0D0D0] hover:text-[#C6A15B]"}`}
              >
                <span className="font-editorial text-xl font-light tracking-wide">{item.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
              </Link>
            ))}
          </div>

          {/* Account section */}
          <div className="px-6 pt-6 pb-4 mt-2 border-t border-[#EBEBEB] dark:border-[#181818]">
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#AAAAAA] dark:text-[#444444] font-sans mb-4">Account</p>
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 border border-[#C6A15B] flex items-center justify-center text-[#C6A15B] text-xs font-bold font-sans">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-[#050505] dark:text-white font-sans font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-[10px] text-[#888888] dark:text-[#555555] font-sans">{user.email}</p>
                  </div>
                </div>
                <Link href="/account" onClick={closeDrawer} className="flex items-center justify-between py-3 text-[11px] uppercase tracking-[0.2em] text-[#050505] dark:text-[#D0D0D0] hover:text-[#C6A15B] font-sans transition-colors border-b border-[#F0F0F0] dark:border-[#141414]">
                  My Account <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </Link>
                <button onClick={handleSignOut} className="w-full flex items-center justify-between py-3 text-[11px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white font-sans transition-colors">
                  Sign Out <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/login" onClick={closeDrawer} className="flex items-center justify-between py-3 text-[11px] uppercase tracking-[0.2em] text-[#050505] dark:text-[#D0D0D0] hover:text-[#C6A15B] font-sans transition-colors border-b border-[#F0F0F0] dark:border-[#141414]">
                  Sign In <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </Link>
                <Link href="/register" onClick={closeDrawer} className="flex items-center justify-between py-3 text-[11px] uppercase tracking-[0.2em] text-[#C6A15B] font-sans transition-colors">
                  Create Account <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Drawer footer */}
        <div className="px-6 py-5 border-t border-[#EBEBEB] dark:border-[#181818] flex-shrink-0 flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#CCCCCC] dark:text-[#333333] font-sans">
            The Forge - Haute Couture
          </p>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
