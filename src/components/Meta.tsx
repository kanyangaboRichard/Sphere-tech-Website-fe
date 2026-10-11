import { Article, categoryName, formatDate } from "@/lib/api";

export default function Meta({ article }: { article: Article }) {
  const category = categoryName(article);
  const date = formatDate(article);
  return (
    <div className="meta">
      {category && <span className="cat">{category}</span>}
      {date && <time>{date}</time>}
      {!!article.readTime && <span>{article.readTime} min read</span>}
    </div>
  );
}
