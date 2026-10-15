import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cover from "@/components/Cover";
import Meta from "@/components/Meta";
import { getArticles, matches } from "@/lib/api";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q = "" } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search" };
}

// Wrap matches of the query in <mark>.
function highlight(text: string, q: string) {
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.split(new RegExp(`(${escaped})`, "gi")).map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q: raw = "" } = await searchParams;
  const q = raw.trim();

 
  const results = q ? (await getArticles({ limit: 500 })).filter(a => matches(a, q)) : [];

  return (
    <>
      <Header query={q} />
      <main className="container">
        <section className="search-hero">
          <h1>{q ? `Results for “${q}”` : "Search stories"}</h1>
          <form action="/search" className="search-big" role="search">
            <input name="q" type="search" defaultValue={q} placeholder="Title, summary, category or tag" aria-label="Search stories" />
            <button type="submit">Search</button>
          </form>
        </section>

        {q && (
          <div className="section-head">
            <h2>{results.length} {results.length === 1 ? "story" : "stories"}</h2>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="empty">
            <h2>No stories match “{q}”</h2>
            <p>Try a shorter or different word, or <Link href="/">go to the front page</Link>.</p>
          </div>
        )}

        <div className="results">
          {results.map(a => (
            <Link key={a.id} href={`/articles/${a.slug}`} className="result">
              <div className="thumb"><Cover article={a} /></div>
              <div>
                <Meta article={a} />
                <h3 className="card-title">{highlight(a.title, q)}</h3>
                {a.excerpt && <p className="card-excerpt">{highlight(a.excerpt, q)}</p>}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}