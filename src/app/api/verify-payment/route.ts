import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/paystack/service";

/**
 * GET /api/verify-payment?reference=...
 * Server-side Paystack verification — keeps the secret key out of the browser.
 */
export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { status: "failed", message: "Payment reference is required" },
      { status: 400 }
    );
  }

  try {
    const result = await verifyPayment(reference);

    if (result.status === "success") {
      return NextResponse.json({
        status: "success",
        amount: result.amount,
        metadata: result.metadata,
      });
    }

    return NextResponse.json(
      { status: "failed", message: `Payment status: ${result.status}` },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json(
      { status: "failed", message },
      { status: 500 }
    );
  }
}
