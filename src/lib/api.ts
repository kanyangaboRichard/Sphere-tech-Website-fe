export type Media = {
  id: string;
  url: string;
  type?: "image" | "video";
  filename?: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  type?: "ARTICLE" | "VIDEO" | "NEWS";
  excerpt?: string | null;
  body?: string | null;
  pullQuote?: string | null;
  tags?: string[] | string | null;
  readTime?: number;
  viewCount?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  publishedAt?: string | null;
  createdAt?: string;
  categoryId?: string | null;
  category?: { id: string; name: string } | null;
  author?: { firstName?: string; lastName?: string } | null;
  coverMedia?: Media | null;
  media?: Media[];
  themeHeroBg?: string | null;
  themeAccentColor?: string | null;
  themeShowPullQuote?: boolean;
};

// Inside Docker: http://backend:5000  ·  Local dev: http://127.0.0.1:5000
const API_URL = (process.env.API_URL || "http://127.0.0.1:5000").replace(/\/$/, "");
const PUBLIC_PATH = process.env.PUBLIC_ARTICLES_PATH || "/api/public/articles";

// The backend may wrap results as { data: [...] }, { data: { articles: [...] } } or a bare array.
function unwrapList(json: any): Article[] {
  const d = json?.data ?? json;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.articles)) return d.articles;
  if (Array.isArray(d?.items)) return d.items;
  return [];
}

function unwrapOne(json: any): Article | null {
  const d = json?.data ?? json;
  return d?.article ?? (d?.slug ? d : null);
}

export async function getArticles(params: { search?: string } = {}): Promise<Article[]> {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  const url = `${API_URL}${PUBLIC_PATH}${qs.size ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) {
      console.error(`GET ${url} → ${res.status}`);
      return [];
    }
    const list = unwrapList(await res.json());
    return list.sort((a, b) => dateOf(b) - dateOf(a));
  } catch (err) {
    console.error(`GET ${url} failed:`, err);
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  const url = `${API_URL}${PUBLIC_PATH}/${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return unwrapOne(await res.json());
  } catch {
    return null;
  }
}

// Search locally as well, so it works whether or not the endpoint supports ?search=
export function matches(a: Article, q: string): boolean {
  const needle = q.toLowerCase();
  return [a.title, a.excerpt, categoryName(a), ...tagList(a)]
    .filter(Boolean)
    .some(s => String(s).toLowerCase().includes(needle));
}

export function dateOf(a: Article): number {
  return new Date(a.publishedAt || a.createdAt || 0).getTime();
}

export function formatDate(a: Article): string {
  const t = dateOf(a);
  if (!t) return "";
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function tagList(a: Article): string[] {
  if (!a.tags) return [];
  return Array.isArray(a.tags) ? a.tags : a.tags.split(",").map(t => t.trim()).filter(Boolean);
}

export function categoryName(a: Article): string | null {
  return a.category?.name ?? null;
}

export function coverUrl(a: Article): string | null {
  return a.coverMedia?.url ?? null;
}

export function typeLabel(a: Article): string {
  return a.type === "VIDEO" ? "Video" : a.type === "NEWS" ? "News" : "Article";
}
