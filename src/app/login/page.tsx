"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/theme/ThemeContext";

const LOGO_DARK  = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4179-e1788079593872.jpg";
const LOGO_LIGHT = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4180.JPG-e1788097102902.jpeg";

export default function LoginPage() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logoSrc = theme === "dark" ? LOGO_DARK : LOGO_LIGHT;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Incorrect email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col lg:flex-row">

      {/* â”€â”€ LEFT: image panel (desktop only) â”€â”€ */}
      <div className="hidden lg:block relative w-[45%] xl:w-1/2 min-h-screen flex-shrink-0">
        <Image
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=90"
          alt="The Forge Atelier"
          fill
          priority
          className="object-cover object-center brightness-[0.55]"
        />
        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-transparent" />

        {/* bottom-left brand copy */}
        <div className="absolute bottom-0 left-0 p-12 space-y-3">
          <p className="text-[9px] uppercase tracking-[0.45em] text-[#C6A15B] font-sans">
            Atelier Account
          </p>
          <p className="font-editorial text-4xl xl:text-5xl text-white font-light leading-tight">
            Crafted for those<br />who demand only<br />
            <span className="italic">the finest.</span>
          </p>
        </div>
      </div>

      {/* â”€â”€ RIGHT: form panel â”€â”€ */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-[#EBEBEB] dark:border-[#181818]">
          <Link href="/" className="relative h-10 w-28 block">
            <Image src={logoSrc} alt="THE FORGE" fill className="object-contain object-left" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-[#888888] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white transition-colors font-sans"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to store
          </Link>
        </div>

        {/* centred form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12">
          <div className="w-full max-w-[400px] space-y-8">

            {/* heading */}
            <div className="space-y-2">
              <p className="text-[9px] uppercase tracking-[0.45em] text-[#C6A15B] font-sans">
                Sign In
              </p>
              <h1 className="font-editorial text-4xl sm:text-5xl text-[#050505] dark:text-white font-light leading-tight">
                Welcome back.
              </h1>
              <p className="text-xs text-[#888888] dark:text-[#555555] font-sans leading-relaxed">
                Access your orders, fittings, and bespoke history.
              </p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="your@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 bottom-[14px] text-[#AAAAAA] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-[11px] text-red-500 font-sans px-0 py-2 border-l-2 border-red-500 pl-3">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="gold"
                className="w-full py-4 mt-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* footer links */}
            <div className="pt-6 border-t border-[#EBEBEB] dark:border-[#181818] space-y-3">
              <p className="text-[11px] text-[#888888] dark:text-[#555555] font-sans">
                New to The Forge?{" "}
                <Link
                  href="/register"
                  className="text-[#050505] dark:text-white hover:text-[#C6A15B] dark:hover:text-[#C6A15B] transition-colors underline underline-offset-2"
                >
                  Create an account
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* bottom bar */}
        <div className="px-6 sm:px-10 py-5 border-t border-[#EBEBEB] dark:border-[#181818]">
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#BBBBBB] dark:text-[#333333] font-sans">
            The Forge â€” Haute Couture and Handmade Custom Dressing
          </p>
        </div>

      </div>
    </div>
  );
}