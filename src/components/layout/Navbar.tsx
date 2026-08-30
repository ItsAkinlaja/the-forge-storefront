"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, ChevronDown, Scissors, User } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const LOGO_DARK  = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4179-e1788079593872.jpg";
const LOGO_LIGHT = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4180.JPG-e1788097102902.jpeg";

interface NavbarProps {
  /** When true the navbar floats over the hero (homepage). Becomes solid on scroll. */
  overlay?: boolean;
}

export function Navbar({ overlay = false }: NavbarProps) {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menOpen, setMenOpen]               = useState(false);
  const [ladyOpen, setLadyOpen]             = useState(false);
  const [accountOpen, setAccountOpen]       = useState(false);
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

  async function handleSignOut() {
    setAccountOpen(false);
    await logout();
    router.push("/");
  }

  const logoSrc   = theme === "dark" ? LOGO_DARK : LOGO_LIGHT;
  const textColor = isTransparent ? "text-white" : "text-[#050505] dark:text-[#D0D0D0]";
  const goldHover = "hover:text-[#C6A15B]";

  return (
    <>
      
      {/* Main header */}
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
                src={isTransparent ? LOGO_DARK : logoSrc}
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
                  className={`flex items-center justify-center w-7 h-7 border border-[#C6A15B] text-[#C6A15B] text-[10px] font-bold font-sans hover:bg-[#C6A15B] hover:text-white transition-all`}
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
          <div className="lg:hidden flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <button onClick={openCart} className={`relative p-1 ${textColor}`} aria-label="Bag">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C6A15B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-1 ${textColor}`} aria-label="Menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </Container>
      </header>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-[#050505] z-[60] lg:hidden flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEBEB] dark:border-[#181818]">
            <div className="relative h-10 w-28">
              <Image src={logoSrc} alt="THE FORGE" fill className="object-contain object-left" />
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-[#050505] dark:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-6 space-y-6 text-xs tracking-[0.2em] uppercase font-sans">
            <div>
              <p className="text-[#C6A15B] text-[9px] font-semibold mb-3 border-b border-[#EBEBEB] dark:border-[#181818] pb-2 tracking-[0.3em]">The Men Forge</p>
              <div className="pl-3 space-y-3 text-[#555555] dark:text-[#888888]">
                <Link href="/the-men-forge" onClick={() => setMobileMenuOpen(false)} className="block text-[#050505] dark:text-white">All Collections</Link>
                <Link href="/the-men-forge/suits-blazers" onClick={() => setMobileMenuOpen(false)} className="block">Suits and Tuxedos</Link>
                <Link href="/the-men-forge/jalamia-kaftans" onClick={() => setMobileMenuOpen(false)} className="block text-[#C6A15B]">Jalamias and Kaftans</Link>
                <Link href="/the-men-forge/luxury-coats" onClick={() => setMobileMenuOpen(false)} className="block">Luxury Coats</Link>
              </div>
            </div>
            <div>
              <p className="text-[#C6A15B] text-[9px] font-semibold mb-3 border-b border-[#EBEBEB] dark:border-[#181818] pb-2 tracking-[0.3em]">The Lady Forge</p>
              <div className="pl-3 space-y-3 text-[#555555] dark:text-[#888888]">
                <Link href="/the-lady-forge" onClick={() => setMobileMenuOpen(false)} className="block text-[#050505] dark:text-white">All Collections</Link>
                <Link href="/the-lady-forge/wedding-dresses" onClick={() => setMobileMenuOpen(false)} className="block text-[#C6A15B]">Wedding and Bridal</Link>
                <Link href="/the-lady-forge/couture-gowns" onClick={() => setMobileMenuOpen(false)} className="block">Couture Gowns</Link>
                <Link href="/the-lady-forge/tailored-suits" onClick={() => setMobileMenuOpen(false)} className="block">Tailored Suits</Link>
              </div>
            </div>
            <div className="pt-2 border-t border-[#EBEBEB] dark:border-[#181818] space-y-3">
              <Link href="/custom-dressing" onClick={() => setMobileMenuOpen(false)} className="block text-[#C6A15B] flex items-center gap-2"><Scissors className="w-3.5 h-3.5" /> Book Bespoke</Link>
              <Link href="/editorial" onClick={() => setMobileMenuOpen(false)} className="block text-[#050505] dark:text-[#D0D0D0]">Lookbook</Link>
              <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="block text-[#050505] dark:text-[#D0D0D0]">Search</Link>
              {isAuthenticated ? (
                <>
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block text-[#050505] dark:text-[#D0D0D0]">My Account</Link>
                  <button onClick={async () => { setMobileMenuOpen(false); await handleSignOut(); }} className="block w-full text-left text-[#888888] dark:text-[#555555] uppercase tracking-[0.2em] text-xs font-sans">Sign Out</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-[#050505] dark:text-[#D0D0D0]">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
