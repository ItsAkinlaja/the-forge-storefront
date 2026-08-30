"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function passwordStrength(password: string): "empty" | "weak" | "strong" {
  if (!password) return "empty";
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  return hasLength && hasNumber ? "strong" : "weak";
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = passwordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength === "weak") {
      setError("Password must be at least 8 characters and contain a number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password, firstName.trim(), lastName.trim());
      router.push("/account");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-[#050505] dark:text-white flex">
      {/* Left — editorial */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 px-16 py-20 border-r border-[#EBEBEB] dark:border-[#181818]">
        <div>
          <Link href="/" className="text-[10px] tracking-[0.35em] uppercase text-[#C6A15B] font-sans">
            The Forge
          </Link>
        </div>
        <div className="max-w-md">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#C6A15B] font-sans mb-6">
            New Account
          </p>
          <h1 className="font-editorial text-6xl xl:text-7xl text-[#050505] dark:text-white leading-[1.05] font-light mb-8">
            Join<br />The Forge.
          </h1>
          <p className="text-sm text-[#555555] dark:text-[#888888] leading-relaxed font-sans max-w-sm">
            Create your account for a personalised bespoke experience. Access exclusive collections, track your orders, and manage your fittings.
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#BBBBBB] dark:text-[#444444] font-sans">
            Handcrafted with precision since 2020
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 py-16">
        {/* Mobile header */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="text-[10px] tracking-[0.35em] uppercase text-[#C6A15B] font-sans block mb-6">
            The Forge
          </Link>
          <h1 className="font-editorial text-4xl text-[#050505] dark:text-white font-light mb-3">
            Join The Forge.
          </h1>
          <p className="text-sm text-[#555555] dark:text-[#888888] font-sans">
            Create your account for a personalised bespoke experience.
          </p>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <p className="hidden lg:block text-[10px] tracking-[0.3em] uppercase text-[#888888] dark:text-[#555555] font-sans mb-10">
            Create your account
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                type="text"
                label="First Name"
                placeholder="First"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                id="lastName"
                type="text"
                label="Last Name"
                placeholder="Last"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Min. 8 characters + number"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 bottom-3.5 text-[#888888] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="flex items-center gap-2 -mt-2">
                <div className="flex gap-1 flex-1">
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      strength === "strong" ? "bg-[#C6A15B]" : "bg-red-400"
                    }`}
                  />
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      strength === "strong" ? "bg-[#C6A15B]" : "bg-[#E5E5E5] dark:bg-[#262626]"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-sans uppercase tracking-[0.15em] ${
                    strength === "strong" ? "text-[#C6A15B]" : "text-red-400"
                  }`}
                >
                  {strength === "strong" ? "Strong" : "Weak"}
                </span>
              </div>
            )}

            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                label="Confirm Password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-4 bottom-3.5 text-[#888888] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-[12px] text-red-500 font-sans border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 px-4 py-3">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="gold"
              className="w-full py-4 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#EBEBEB] dark:border-[#181818]">
            <p className="text-[11px] text-[#888888] dark:text-[#555555] font-sans tracking-wide">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#050505] dark:text-white underline underline-offset-2 hover:text-[#C6A15B] dark:hover:text-[#C6A15B] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
