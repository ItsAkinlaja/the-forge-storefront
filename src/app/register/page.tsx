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
const LOGO_LIGHT = "https://central.theforgebrand.shop/wp-content/uploads/2026/08/IMG_4180.JPG-e1788097102902-removebg-preview.png";

function passwordStrength(p: string): "empty" | "weak" | "strong" {
  if (!p) return "empty";
  return p.length >= 8 && /\d/.test(p) ? "strong" : "weak";
}

export default function RegisterPage() {
  const { register } = useAuth();
  const { theme }    = useTheme();
  const router       = useRouter();

  const [firstName, setFirstName]         = useState("");
  const [lastName, setLastName]           = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirm]     = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [error, setError]                 = useState("");
  const [isSubmitting, setIsSubmitting]   = useState(false);

  const strength = passwordStrength(password);
  const logoSrc  = theme === "dark" ? LOGO_DARK : LOGO_LIGHT;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim()) { setError("First and last name are required."); return; }
    if (strength === "weak")                    { setError("Password must be at least 8 characters and contain a number."); return; }
    if (password !== confirmPassword)           { setError("Passwords do not match."); return; }

    setIsSubmitting(true);
    try {
      await register(email, password, firstName.trim(), lastName.trim());
      router.push("/account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col lg:flex-row">

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ LEFT: image panel Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="hidden lg:block relative w-[45%] xl:w-1/2 min-h-screen flex-shrink-0">
        <Image
          src="https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1400&q=90"
          alt="The Forge Atelier"
          fill
          priority
          className="object-cover object-top brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-12 space-y-3">
          <p className="text-[9px] uppercase tracking-[0.45em] text-[#C6A15B] font-sans">New Account</p>
          <p className="font-editorial text-4xl xl:text-5xl text-white font-light leading-tight">
            Join an atelier<br />built for those<br />
            <span className="italic">who expect more.</span>
          </p>
        </div>
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ RIGHT: form panel Ã¢â€â‚¬Ã¢â€â‚¬ */}
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

        {/* scrollable form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12">
          <div className="w-full max-w-[400px] space-y-8">

            {/* heading */}
            <div className="space-y-2">
              <p className="text-[9px] uppercase tracking-[0.45em] text-[#C6A15B] font-sans">Create Account</p>
              <h1 className="font-editorial text-4xl sm:text-5xl text-[#050505] dark:text-white font-light leading-tight">
                Join The Forge.
              </h1>
              <p className="text-xs text-[#888888] dark:text-[#555555] font-sans leading-relaxed">
                A personalised bespoke experience awaits.
              </p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input id="firstName" type="text"  label="First Name" placeholder="First"
                  autoComplete="given-name"  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)} required />
                <Input id="lastName"  type="text"  label="Last Name"  placeholder="Last"
                  autoComplete="family-name" value={lastName}
                  onChange={(e) => setLastName(e.target.value)}  required />
              </div>

              <Input id="email" type="email" label="Email Address" placeholder="your@email.com"
                autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required />

              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"}
                  label="Password" placeholder="Min. 8 characters and a number"
                  autoComplete="new-password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 bottom-[14px] text-[#AAAAAA] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white transition-colors"
                  aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* strength bar */}
              {password.length > 0 && (
                <div className="flex items-center gap-3 -mt-1">
                  <div className="flex gap-1 flex-1 h-px">
                    <div className={`flex-1 h-px ${strength === "strong" ? "bg-[#C6A15B]" : "bg-red-400"}`} />
                    <div className={`flex-1 h-px ${strength === "strong" ? "bg-[#C6A15B]" : "bg-[#E5E5E5] dark:bg-[#262626]"}`} />
                  </div>
                  <span className={`text-[9px] uppercase tracking-[0.2em] font-sans ${strength === "strong" ? "text-[#C6A15B]" : "text-red-400"}`}>
                    {strength === "strong" ? "Strong" : "Weak"}
                  </span>
                </div>
              )}

              <div className="relative">
                <Input id="confirmPassword" type={showConfirm ? "text" : "password"}
                  label="Confirm Password" placeholder="Repeat your password"
                  autoComplete="new-password" value={confirmPassword}
                  onChange={(e) => setConfirm(e.target.value)} required />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 bottom-[14px] text-[#AAAAAA] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white transition-colors"
                  aria-label="Toggle confirm password visibility">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-[11px] text-red-500 font-sans border-l-2 border-red-500 pl-3 py-1">
                  {error}
                </p>
              )}

              <Button type="submit" variant="gold" className="w-full py-4 mt-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* footer */}
            <div className="pt-6 border-t border-[#EBEBEB] dark:border-[#181818]">
              <p className="text-[11px] text-[#888888] dark:text-[#555555] font-sans">
                Already have an account?{" "}
                <Link href="/login"
                  className="text-[#050505] dark:text-white hover:text-[#C6A15B] dark:hover:text-[#C6A15B] transition-colors underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* bottom bar */}
        <div className="px-6 sm:px-10 py-5 border-t border-[#EBEBEB] dark:border-[#181818]">
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#BBBBBB] dark:text-[#333333] font-sans">
            The Forge Ã¢â‚¬â€ Haute Couture and Handmade Custom Dressing
          </p>
        </div>

      </div>
    </div>
  );
}