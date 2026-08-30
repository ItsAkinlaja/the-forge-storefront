/**
 * Paystack integration service.
 *
 * initializePayment  — server-side only (uses secret key)
 * verifyPayment      — server-side only (uses secret key)
 *
 * NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY — exposed to browser for inline/popup SDK
 * PAYSTACK_SECRET_KEY             — server only, never exposed
 */

export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

const PAYSTACK_API = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

export interface PaystackInitResult {
  authorizationUrl: string;
  reference: string;
  accessCode: string;
}

export interface PaystackVerifyResult {
  status: string;
  amount: number;
  metadata: Record<string, unknown>;
}

/**
 * Initialize a Paystack transaction.
 * amount — value in NGN (kobo conversion is handled internally)
 */
export async function initializePayment(
  amount: number,
  email: string,
  metadata: object,
  callbackUrl: string
): Promise<PaystackInitResult> {
  const secretKey = getSecretKey();

  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // NGN to kobo
      currency: "NGN",
      callback_url: callbackUrl,
      metadata,
    }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.status) {
    throw new Error(data?.message || "Failed to initialize Paystack payment");
  }

  return {
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
    accessCode: data.data.access_code,
  };
}

/**
 * Verify a Paystack transaction by reference.
 */
export async function verifyPayment(
  reference: string
): Promise<PaystackVerifyResult> {
  const secretKey = getSecretKey();

  const res = await fetch(
    `${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok || !data.status) {
    throw new Error(data?.message || "Failed to verify Paystack payment");
  }

  return {
    status: data.data.status,
    amount: data.data.amount / 100, // kobo to NGN
    metadata: data.data.metadata || {},
  };
}
