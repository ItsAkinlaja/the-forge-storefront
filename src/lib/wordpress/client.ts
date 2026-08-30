import { MOCK_PRODUCTS, MOCK_COLLECTIONS } from "@/data/mockData";
import { Product, Collection, MainCategory, Subcategory } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_WP_API_URL || "https://central.theforgebrand.shop/wp-json";

export interface WPFetchOptions {
  revalidate?: number | false;
  tags?: string[];
  token?: string;
  method?: string;
  body?: unknown;
}

export class WordPressClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE;
  }

  async fetchAPI<T>(endpoint: string, options: WPFetchOptions = {}): Promise<T | null> {
    const { revalidate = 60, tags, token, method = "GET", body } = options;
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        next: method === "GET" ? { revalidate, tags } : undefined,
        cache: method !== "GET" ? "no-store" : undefined,
      });

      if (!res.ok) {
        console.warn(`[ForgeAPI] ${method} ${url} -> ${res.status}`);
        return null;
      }

      return (await res.json()) as T;
    } catch (error) {
      console.warn(`[ForgeAPI] Network error: ${url}`, error);
      return null;
    }
  }

  // ---------------------------------------------------------------- PRODUCTS

  async getProducts(params?: {
    mainCategory?: MainCategory;
    subcategory?: Subcategory;
    featured?: boolean;
    search?: string;
    perPage?: number;
    page?: number;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.mainCategory) query.set("main_category", params.mainCategory);
    if (params?.subcategory)  query.set("subcategory",   params.subcategory);
    if (params?.featured)     query.set("featured",      "1");
    if (params?.search)       query.set("search",        params.search);
    if (params?.perPage)      query.set("per_page",      String(params.perPage));
    if (params?.page)         query.set("page",          String(params.page));

    const result = await this.fetchAPI<Product[]>(`/forge/v1/products?${query}`, { revalidate: 60 });

    if (result && Array.isArray(result) && result.length > 0) return result;

    // Fallback to mock data
    let mock = [...MOCK_PRODUCTS];
    if (params?.mainCategory) mock = mock.filter(p => p.mainCategory === params.mainCategory);
    if (params?.subcategory)  mock = mock.filter(p => p.subcategory  === params.subcategory);
    if (params?.featured)     mock = mock.filter(p => p.featured);
    if (params?.search) {
      const q = params.search.toLowerCase();
      mock = mock.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return mock;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const result = await this.fetchAPI<Product>(`/forge/v1/products/${slug}`, { revalidate: 60 });
    if (result) return result;
    return MOCK_PRODUCTS.find(p => p.slug === slug) ?? null;
  }

  async getCollectionByMainCategory(category: MainCategory): Promise<Collection | null> {
    const result = await this.fetchAPI<Collection>(`/forge/v1/collections/${category}`, { revalidate: 3600 });
    if (result) return result;
    return MOCK_COLLECTIONS.find(c => c.mainCategory === category) ?? null;
  }
}

export const wpClient = new WordPressClient();
