import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Meta from "@/components/Meta";
import Cover from "@/components/Cover";
import { getArticle, coverUrl, tagList } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return { title: "Story not found" };
  const image = coverUrl(a);
  return {
    title: a.title,
    description: a.excerpt ?? undefined,
    openGraph: { title: a.title, description: a.excerpt ?? undefined, images: image ? [image] : undefined },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const tags = tagList(article);
  const gallery = article.media ?? [];
  const author = [article.author?.firstName, article.author?.lastName].filter(Boolean).join(" ");

  return (
    <>
      <Header />
      <article className="article">
        <Meta article={article} />
        <h1>{article.title}</h1>
        {author && <div className="byline">By {author}</div>}

        {coverUrl(article) && <div className="hero"><Cover article={article} /></div>}

        {article.excerpt && <p className="lede">{article.excerpt}</p>}
        {article.pullQuote && article.themeShowPullQuote !== false && (
          <blockquote className="pull-quote" style={article.themeAccentColor ? { borderColor: article.themeAccentColor } : undefined}>
            {article.pullQuote}
          </blockquote>
        )}
      {article.body && (
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.body }} />
          )}

        {gallery.length > 0 && (
          <div className="gallery">
            {gallery.map(m =>
              m.type === "video"
                ? <video key={m.id} src={m.url} controls preload="metadata" />
                : <img key={m.id} src={m.url} alt={m.filename ?? ""} loading="lazy" />
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="tags">
            {tags.map(t => <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="tag">{t}</Link>)}
          </div>
        )}
      </article>
      <Footer />
    </>
  );
}
