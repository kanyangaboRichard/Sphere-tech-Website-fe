import Link from "next/link";
import { Article } from "@/lib/api";
import Cover from "./Cover";
import Meta from "./Meta";
import Headline from "./Headline";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="card">
      <div className="thumb"><Cover article={article} /></div>
      <h3 className="card-title"><Headline article={article} /></h3>
      <div style={{ marginTop: 8 }}><Meta article={article} /></div>
    </Link>
  );
}
