"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getOrder } from "@/lib/checkout/service";
import { getToken } from "@/lib/auth/service";
import { Order } from "@/types";

function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

// Skeleton while loading
function ConfirmationSkeleton() {
  return (
    <div className="py-20 max-w-2xl mx-auto space-y-6">
      <div className="w-16 h-16 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse mx-auto" />
      <div className="h-8 w-64 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse mx-auto" />
      <div className="h-4 w-40 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse mx-auto" />
      <div className="border border-[#E5E5E5] dark:border-[#262626] p-7 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-16 h-20 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-full bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
              <div className="h-2.5 w-20 bg-[#F0F0F0] dark:bg-[#1C1C1C] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      setIsLoading(true);
      try {
        // Verify payment server-side via API route
        if (reference) {
          const res = await fetch(`/api/verify-payment?reference=${encodeURIComponent(reference)}`, {
            cache: "no-store",
          });
          const data = await res.json();

          if (cancelled) return;

          if (res.ok && data.status === "success") {
            setPaymentStatus("success");
          } else {
            setPaymentStatus("failed");
            setErrorMessage(data?.message || "Payment could not be verified.");
            setIsLoading(false);
            return;
          }
        } else {
          // No reference — could be a redirect without payment
          setPaymentStatus("success");
        }

        // Fetch order details
        if (orderId) {
          const token = getToken() || undefined;
          try {
            const fetchedOrder = await getOrder(orderId, token);
            if (!cancelled) setOrder(fetchedOrder);
          } catch {
            // Order fetch failed — show success without order details
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setPaymentStatus("failed");
          setErrorMessage(
            err instanceof Error ? err.message : "An error occurred during verification."
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    verify();
    return () => { cancelled = true; };
  }, [reference, orderId]);

  if (isLoading) {
    return <ConfirmationSkeleton />;
  }

  if (paymentStatus === "failed") {
    return (
      <div className="py-20 max-w-xl mx-auto text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto stroke-[1]" />
        <h1 className="font-editorial text-3xl text-[#050505] dark:text-white font-light">
          Payment Verification Failed
        </h1>
        <p className="text-xs text-[#555555] dark:text-[#A0A0A0] leading-relaxed font-sans max-w-sm mx-auto">
          {errorMessage || "We could not verify your payment. If funds were deducted, contact our support team with your reference number."}
        </p>
        {reference && (
          <p className="text-[11px] text-[#888888] dark:text-[#555555] font-sans border border-[#E5E5E5] dark:border-[#262626] px-4 py-2 inline-block">
            Reference: <span className="text-[#050505] dark:text-white font-medium">{reference}</span>
          </p>
        )}
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="outline" size="md">Continue Shopping</Button>
          </Link>
          <a href="mailto:support@theforgebrand.shop">
            <Button variant="gold" size="md">Contact Support</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 max-w-2xl mx-auto space-y-10">
      {/* Success header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border border-[#C6A15B]/30 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-[#C6A15B] stroke-[1]" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C6A15B] font-semibold font-sans mb-1">
            Payment Confirmed
          </p>
          <h1 className="font-editorial text-4xl text-[#050505] dark:text-white font-light">
            Order Confirmed
          </h1>
        </div>
        {order && (
          <p className="text-xs text-[#666666] dark:text-[#888888] font-sans">
            Order <span className="text-[#050505] dark:text-white font-semibold">#{order.orderNumber}</span>
            {" — "}a confirmation will be sent to{" "}
            <span className="text-[#050505] dark:text-white">{order.shippingAddress.email}</span>
          </p>
        )}
        {!order && reference && (
          <p className="text-xs text-[#666666] dark:text-[#888888] font-sans">
            Reference: <span className="text-[#050505] dark:text-white font-medium">{reference}</span>
          </p>
        )}
      </div>

      {order && (
        <>
          {/* Items */}
          <div className="border border-[#E5E5E5] dark:border-[#262626] divide-y divide-[#E5E5E5] dark:divide-[#1C1C1C]">
            <div className="px-6 py-4">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#888888] dark:text-[#555555] font-sans font-semibold">
                Items Ordered
              </h2>
            </div>
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 px-6 py-4">
                <div className="relative w-14 h-20 flex-shrink-0 border border-[#E5E5E5] dark:border-[#262626] overflow-hidden bg-[#F5F5F5] dark:bg-[#121212]">
                  <Image
                    src={item.product.images[0]?.src || "/images/placeholder.jpg"}
                    alt={item.product.name}
                    fill
                    className="object-cover object-top"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#050505] dark:text-white font-sans font-medium leading-tight">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] text-[#888888] dark:text-[#555555] font-sans mt-0.5">
                    {item.selectedSize} &middot; Qty {item.quantity}
                  </p>
                </div>
                <span className="text-sm text-[#050505] dark:text-white font-sans font-medium flex-shrink-0">
                  {formatNGN(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Address + total */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-[#E5E5E5] dark:border-[#262626] p-5 space-y-3">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#888888] dark:text-[#555555] font-sans font-semibold">
                Shipping To
              </h2>
              <address className="not-italic text-xs text-[#555555] dark:text-[#A0A0A0] font-sans leading-relaxed space-y-0.5">
                <p className="text-[#050505] dark:text-white font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phone}</p>
              </address>
            </div>

            <div className="border border-[#E5E5E5] dark:border-[#262626] p-5 space-y-3">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#888888] dark:text-[#555555] font-sans font-semibold">
                Payment Summary
              </h2>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between text-[#666666] dark:text-[#888888]">
                  <span>Subtotal</span>
                  <span>{formatNGN(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#666666] dark:text-[#888888]">
                  <span>Delivery</span>
                  <span className="text-[#C6A15B]">Free</span>
                </div>
                <div className="border-t border-[#E5E5E5] dark:border-[#1C1C1C] pt-2 flex justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#050505] dark:text-white">
                    Total Paid
                  </span>
                  <span className="font-editorial text-xl text-[#C6A15B]">
                    {order.formattedTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <Link href="/">
          <Button variant="outline" size="md">Continue Shopping</Button>
        </Link>
        <Link href="/account/orders">
          <Button variant="gold" size="md">View My Orders</Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-[#050505] dark:text-white">
      <Navbar />
      <main className="flex-1 py-8">
        <Container size="narrow">
          <Suspense fallback={<ConfirmationSkeleton />}>
            <OrderConfirmationContent />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
