import type { Article } from "@/lib/api";
import Bolt from "./Bolt";

// Headline text with the breaking bolt and a Video badge where they apply.
export default function Headline({ article }: { article: Article }) {
  return (
    <>
      {article.isBreaking && <span className="bolt-inline" role="img" aria-label="Breaking"><Bolt size={17} /></span>}
      {article.title}
      {article.type === "VIDEO" && <span className="badge video">Video</span>}
    </>
  );
}
