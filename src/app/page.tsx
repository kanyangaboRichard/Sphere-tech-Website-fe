import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Cover from "@/components/Cover";
import Meta from "@/components/Meta";
import Headline from "@/components/Headline";
import { getArticles, dateOf, type Article } from "@/lib/api";

// Render per request so the page never ships an empty build-time snapshot.
export const dynamic = "force-dynamic";

function Row({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="row">
      <div className="thumb"><Cover article={article} /></div>
      <h3 className="row-title"><Headline article={article} /></h3>
    </Link>
  );
}

export default async function HomePage() {
  const articles = await getArticles();

  // Lead: newest featured story, else the newest story.
  const lead = articles.find(a => a.isFeatured) ?? articles[0];
  const rest = articles.filter(a => a !== lead);
  const middle = rest.slice(0, 7);
  const underLead = rest.slice(7, 10);
  const latest = rest.slice(10);

  // Most read: ranked by views, newest first on ties. A ranking, so it may repeat stories shown elsewhere.
  const mostRead = [...articles]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0) || dateOf(b) - dateOf(a))
    .slice(0, 6);
  const [railTop, ...railRest] = mostRead;

  return (
    <>
      <Header />
      <main className="container">
        {!lead ? (
          <div className="empty">
            <h2>No published stories yet</h2>
            <p>Publish an article in the CMS and it will appear here.</p>
          </div>
        ) : (
          <>
            <section className="front">
              <div className="col col-1">
                <Link href={`/articles/${lead.slug}`} className="lead">
                  <Cover article={lead} />
                  <div className="lead-body">
                    <Meta article={lead} />
                    <h1 className="lead-title"><Headline article={lead} /></h1>
                    {lead.excerpt && <p className="lead-excerpt">{lead.excerpt}</p>}
                  </div>
                </Link>
                {underLead.map(a => <Row key={a.id} article={a} />)}
              </div>

              <div className="col col-2">
                {middle.map(a => <Row key={a.id} article={a} />)}
              </div>

              {railTop && (
                <aside className="col col-3" aria-labelledby="most-read">
                  <div className="rail-head"><h2 id="most-read">Most read</h2></div>
                  <Link href={`/articles/${railTop.slug}`} className="rail-top">
                    <div className="thumb"><Cover article={railTop} /></div>
                    <h3><Headline article={railTop} /></h3>
                  </Link>
                  {railRest.map(a => (
                    <Link key={a.id} href={`/articles/${a.slug}`} className="rail-item">
                      <h3><Headline article={a} /></h3>
                    </Link>
                  ))}
                </aside>
              )}
            </section>

            {latest.length > 0 && (
              <section id="latest">
                <div className="section-head"><h2>More stories</h2></div>
                <div className="grid">
                  {latest.map(a => <ArticleCard key={a.id} article={a} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
