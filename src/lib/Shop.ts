export type ShopCategory = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  order?: number;
  isActive?: boolean;
};

export type ShopProduct = {
  id: string;
  name: string;
  image?: string | null;
  unit?: string | null;
  price: number;
  originalPrice?: number | null;
  badge?: string | null;
  isNewArrival?: boolean;
  isDeal?: boolean;
  isActive?: boolean;
  link?: string | null;
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
};

// Same backend, same env convention as lib/api.ts
const API_URL = (process.env.API_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

function unwrapList<T>(json: any): T[] {
  const d = json?.data ?? json;
  return Array.isArray(d) ? d : [];
}

export async function getShopCategories(): Promise<ShopCategory[]> {
  const url = `${API_URL}/api/shop-categories/public`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`GET ${url} → ${res.status}`);
      return [];
    }
    const list = unwrapList<ShopCategory>(await res.json());
    return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (err) {
    console.error(`GET ${url} failed:`, err);
    return [];
  }
}

export async function getShopProducts(params: { categoryId?: string; search?: string } = {}): Promise<ShopProduct[]> {
  const qs = new URLSearchParams();
  if (params.categoryId) qs.set("categoryId", params.categoryId);
  if (params.search) qs.set("search", params.search);
  const url = `${API_URL}/api/shop-products/public${qs.size ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`GET ${url} → ${res.status}`);
      return [];
    }
    const list = unwrapList<ShopProduct>(await res.json());
    return list.sort((a, b) => (a.category?.order ?? 0) - (b.category?.order ?? 0));
  } catch (err) {
    console.error(`GET ${url} failed:`, err);
    return [];
  }
}

export function discountPercent(p: ShopProduct): number | null {
  if (!p.originalPrice || p.originalPrice <= p.price) return null;
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}