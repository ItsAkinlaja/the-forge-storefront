import { getToken } from "@/lib/auth/service";
import { Product, BespokeMeasurementData } from "@/types";

const API = process.env.NEXT_PUBLIC_WP_API_URL || "https://central.theforgebrand.shop/wp-json";
const BASE = `${API}/forge/v1/cart`;

export interface ServerCartItem {
  id: string;
  productId: number;
  quantity: number;
  selectedSize: string;
  bespokeMeasurements?: BespokeMeasurementData | null;
  addedAt: number;
  product: Product;
}

export interface ServerCart {
  items: ServerCartItem[];
  count: number;
  subtotal: number;
  formattedSubtotal: string;
}

function authHeader(): Record<string, string> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function fetchCart(): Promise<ServerCart> {
  const res = await fetch(BASE, { headers: authHeader(), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToServerCart(
  productId: number | string,
  quantity = 1,
  selectedSize?: string,
  bespokeMeasurements?: BespokeMeasurementData
): Promise<ServerCart> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ productId: Number(productId), quantity, selectedSize, bespokeMeasurements }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to add item to cart");
  return res.json();
}

export async function updateServerCartItem(itemId: string, quantity: number): Promise<ServerCart> {
  const res = await fetch(`${BASE}/${itemId}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ quantity }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json();
}

export async function removeServerCartItem(itemId: string): Promise<ServerCart> {
  const res = await fetch(`${BASE}/${itemId}`, {
    method: "DELETE",
    headers: authHeader(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to remove cart item");
  return res.json();
}

export async function clearServerCart(): Promise<ServerCart> {
  const res = await fetch(BASE, {
    method: "DELETE",
    headers: authHeader(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to clear cart");
  return res.json();
}
