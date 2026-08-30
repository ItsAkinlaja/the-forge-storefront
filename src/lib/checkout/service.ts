import { CartItem, ShippingAddress, Order } from "@/types";
import { getToken } from "@/lib/auth/service";

const API =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  "https://central.theforgebrand.shop/wp-json";
const FORGE_BASE = `${API}/forge/v1`;

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
  paystackAuthUrl: string;
  reference: string;
}

function buildHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const t = token || getToken();
  if (t) headers["Authorization"] = `Bearer ${t}`;
  return headers;
}

/**
 * Create an order on the WP backend and receive a Paystack auth URL.
 */
export async function createOrder(
  items: CartItem[],
  shippingAddress: ShippingAddress,
  token?: string
): Promise<CreateOrderResult> {
  const callbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/order-confirmation`
      : "/order-confirmation";

  const payload = {
    items: items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      bespokeMeasurements: item.bespokeMeasurements || null,
    })),
    shippingAddress,
    callbackUrl,
  };

  const res = await fetch(`${FORGE_BASE}/checkout`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || `Checkout failed (${res.status})`);
  }

  return {
    orderId: String(data.orderId),
    orderNumber: String(data.orderNumber),
    paystackAuthUrl: data.paystackAuthUrl,
    reference: data.reference,
  };
}

/**
 * Fetch a single order by ID (requires auth).
 */
export async function getOrder(
  orderId: string,
  token?: string
): Promise<Order> {
  const res = await fetch(`${FORGE_BASE}/orders/${encodeURIComponent(orderId)}`, {
    headers: buildHeaders(token),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || `Failed to fetch order (${res.status})`);
  }

  return data as Order;
}
