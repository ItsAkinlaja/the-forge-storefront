const API = process.env.NEXT_PUBLIC_WP_API_URL || "https://central.theforgebrand.shop/wp-json";
const FORGE_BASE = `${API}/forge/v1`;
const TOKEN_KEY  = "forge_auth_token";

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phone?: string;
  roles: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function forgePost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res  = await fetch(`${FORGE_BASE}${path}`, { method: "POST", headers, body: JSON.stringify(body), cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data as T;
}

async function forgePatch<T>(path: string, body: unknown, token: string): Promise<T> {
  const res  = await fetch(`${FORGE_BASE}${path}`, { method: "PATCH", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(body), cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data as T;
}

async function forgeGet<T>(path: string, token: string): Promise<T> {
  const res  = await fetch(`${FORGE_BASE}${path}`, { headers: { "Authorization": `Bearer ${token}` }, cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data as T;
}

export async function login(email: string, password: string, guestCartToken?: string): Promise<AuthResponse> {
  const body: Record<string, string> = { email, password };
  if (guestCartToken) body.guestCartToken = guestCartToken;
  const result = await forgePost<AuthResponse>("/auth/login", body);
  setToken(result.token);
  return result;
}

export async function register(email: string, password: string, firstName: string, lastName: string, guestCartToken?: string): Promise<AuthResponse> {
  const body: Record<string, string> = { email, password, firstName, lastName };
  if (guestCartToken) body.guestCartToken = guestCartToken;
  const result = await forgePost<AuthResponse>("/auth/register", body);
  setToken(result.token);
  return result;
}

export async function logout(): Promise<void> {
  const token = getToken();
  if (token) {
    try { await forgePost("/auth/logout", {}, token); } catch {}
  }
  clearToken();
}

export async function getMe(token?: string): Promise<AuthUser | null> {
  const t = token || getToken();
  if (!t) return null;
  try { return await forgeGet<AuthUser>("/auth/me", t); }
  catch { clearToken(); return null; }
}

export async function updateProfile(data: Partial<Pick<AuthUser, "firstName" | "lastName" | "phone">>): Promise<AuthUser> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return forgePatch<AuthUser>("/users/me", data, token);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  await forgePatch<{ success: boolean }>("/users/me/password", { currentPassword, newPassword }, token);
}

export async function getOrders(): Promise<unknown[]> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return forgeGet<unknown[]>("/users/me/orders", token);
}
