const COOKIE_KEY = "forge_guest_cart";
const EXPIRES_DAYS = 30;

function generateToken(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}

export function getGuestToken(): string {
  if (typeof document === "undefined") return "";

  const match = document.cookie.split(";").find(c => c.trim().startsWith(COOKIE_KEY + "="));
  if (match) {
    const val = match.split("=")[1]?.trim();
    if (val) return val;
  }

  const token = generateToken();
  const expires = new Date(Date.now() + EXPIRES_DAYS * 864e5).toUTCString();
  document.cookie = `${COOKIE_KEY}=${token};expires=${expires};path=/;SameSite=Lax`;
  return token;
}

export function clearGuestToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}
