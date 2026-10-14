import Link from "next/link";
import { getArticles } from "@/lib/api";
import Bolt from "./Bolt";

const SECTIONS = ["Latest", "AI", "Cybersecurity", "Startups", "Gadgets", "Business", "Videos", "Opinion","Shop with us"];

// Server component: pulls the newest breaking story (or the newest story) for the ticker.
export default async function Header({ query = "" }: { query?: string }) {
  const articles = await getArticles();
  const ticker = articles.find(a => a.isBreaking) ?? articles[0];

  return (
    <header className="masthead">
      <div className="container">
        <Link href="/" className="logo-block" aria-label="Sphere Tech home">
          <span className="mono">ST</span>
          <span className="word">Sphere Tech</span>
        </Link>

        <div className="mast-top">
          <span className="tagline">Technology, <span>explained.</span></span>
          {ticker && (
            <div className="ticker">
              <span className="bolt"><Bolt size={18} /></span>
              <Link href={`/articles/${ticker.slug}`}>{ticker.title}</Link>
            </div>
          )}
          <form action="/search" className="mast-search" role="search">
            <input name="q" type="search" placeholder="Search stories" defaultValue={query} aria-label="Search stories" />
            <button type="submit" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
          </form>
        </div>

        <nav className="sections" aria-label="Sections">
          {SECTIONS.map(s => (
            <Link key={s} href={s === "Latest" ? "/#latest" : `/search?q=${encodeURIComponent(s)}`}>{s}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
