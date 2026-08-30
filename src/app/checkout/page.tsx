"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/components/cart/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/checkout/service";
import { getToken } from "@/lib/auth/service";
import { ShippingAddress } from "@/types";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

const EMPTY_FORM: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "Nigeria",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState<ShippingAddress>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>("");

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.replace("/cart");
    }
  }, [cart, router]);

  // Pre-fill from auth
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [isAuthenticated, user]);

  function set(field: keyof ShippingAddress, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validate(): boolean {
    const e: Partial<ShippingAddress> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state) e.state = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      const token = getToken() || undefined;
      const result = await createOrder(cart, form, token);
      if (result.paystackAuthUrl) {
        window.location.href = result.paystackAuthUrl;
      } else {
        router.push(`/order-confirmation?orderId=${result.orderId}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setServerError(msg);
      setIsLoading(false);
    }
  }

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white">
      {/* Minimal header */}
      <header className="border-b border-[#E5E5E5] dark:border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] hover:text-[#050505] dark:hover:text-white transition-colors font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Bag
          </Link>
          <Link href="/" className="font-editorial text-xl text-[#050505] dark:text-white tracking-widest">
            THE FORGE
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] text-[#888888] dark:text-[#555555] font-sans uppercase tracking-wider">
            <Lock className="w-3 h-3 text-[#C6A15B]" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Shipping form */}
            <div className="lg:col-span-7">
              <h1 className="font-editorial text-3xl text-[#050505] dark:text-white font-light mb-8">
                Shipping Details
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    id="firstName"
                    label="First Name"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    error={errors.firstName}
                    autoComplete="given-name"
                  />
                  <Input
                    id="lastName"
                    label="Last Name"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    error={errors.lastName}
                    autoComplete="family-name"
                  />
                </div>

                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  error={errors.email}
                  autoComplete="email"
                />

                <Input
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  error={errors.phone}
                  placeholder="+234"
                  autoComplete="tel"
                />

                <Input
                  id="address"
                  label="Delivery Address"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  error={errors.address}
                  placeholder="Street address, apartment, etc."
                  autoComplete="street-address"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    id="city"
                    label="City"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    error={errors.city}
                    autoComplete="address-level2"
                  />

                  {/* State dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="state"
                      className="uppercase tracking-[0.2em] text-[10px] text-[#888888] dark:text-[#555555] font-sans font-semibold"
                    >
                      State
                    </label>
                    <select
                      id="state"
                      value={form.state}
                      onChange={(e) => set("state", e.target.value)}
                      className={[
                        "w-full border border-[#E5E5E5] dark:border-[#262626]",
                        "bg-white dark:bg-[#0A0A0A]",
                        "px-4 py-3.5 text-sm text-[#050505] dark:text-white",
                        "focus:outline-none focus:border-[#050505] dark:focus:border-white",
                        "font-sans appearance-none",
                        errors.state ? "border-red-500" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      autoComplete="address-level1"
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-[11px] text-red-500 mt-0.5 font-sans">{errors.state}</p>
                    )}
                  </div>
                </div>

                <Input
                  id="country"
                  label="Country"
                  value="Nigeria"
                  readOnly
                  className="bg-[#F9F9F9] dark:bg-[#121212] cursor-not-allowed"
                />

                {serverError && (
                  <div className="border border-red-500/30 bg-red-50 dark:bg-red-950/20 p-4">
                    <p className="text-xs text-red-600 dark:text-red-400 font-sans">{serverError}</p>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Processing..." : "Pay with Paystack"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-8 border border-[#E5E5E5] dark:border-[#262626] p-7 space-y-6 bg-white dark:bg-[#0A0A0A]">
              <h2 className="font-editorial text-xl text-[#050505] dark:text-white font-light border-b border-[#E5E5E5] dark:border-[#1C1C1C] pb-4">
                Your Order
              </h2>

              {/* Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-14 h-18 flex-shrink-0 border border-[#E5E5E5] dark:border-[#262626] overflow-hidden bg-[#F5F5F5] dark:bg-[#121212]">
                      <Image
                        src={item.product.images[0]?.src || "/images/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover object-top"
                        sizes="56px"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#050505] dark:bg-white text-white dark:text-[#050505] text-[10px] flex items-center justify-center font-sans font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#050505] dark:text-white font-sans font-medium leading-tight truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-[#888888] dark:text-[#555555] font-sans mt-0.5">
                        {item.selectedSize}
                      </p>
                    </div>
                    <span className="text-xs text-[#050505] dark:text-white font-sans font-medium flex-shrink-0">
                      {formatNGN(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-xs font-sans border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-5">
                <div className="flex justify-between text-[#666666] dark:text-[#888888]">
                  <span>Subtotal</span>
                  <span className="text-[#050505] dark:text-white">{formatNGN(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#666666] dark:text-[#888888]">
                  <span>Delivery</span>
                  <span className="text-[#C6A15B]">Free</span>
                </div>
                <div className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-3 flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#050505] dark:text-white">
                    Total
                  </span>
                  <span className="font-editorial text-2xl text-[#050505] dark:text-white">
                    {formatNGN(subtotal)}
                  </span>
                </div>
              </div>

              {/* Paystack badge */}
              <div className="space-y-3 border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-5">
                <div className="flex items-center justify-center border border-[#E5E5E5] dark:border-[#262626] py-3 px-4 gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#888888] dark:text-[#555555] font-sans">
                    Secured by Paystack
                  </span>
                </div>
                <p className="text-[10px] text-center text-[#AAAAAA] dark:text-[#555555] font-sans">
                  Paystack 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
