"use client";

import { useState } from "react";
import type { Article } from "@/lib/api";

const TYPE_LABEL = { ARTICLE: "Article", VIDEO: "Video", NEWS: "News" } as const;

// Cover image, or a themed placeholder when there is none or it fails to load.
export default function Cover({ article, className }: { article: Article; className?: string }) {
  const [failed, setFailed] = useState(false);
  const src = article.coverMedia?.url;

  if (src && !failed) {
    return <img src={src} alt="" className={className} loading="lazy" onError={() => setFailed(true)} />;
  }
  return (
    <div className="placeholder" style={{ background: article.themeHeroBg || "var(--navy-800)" }}>
      <span style={{ color: article.themeAccentColor || "var(--cyan)" }}>
        {TYPE_LABEL[article.type ?? "ARTICLE"] ?? "Article"}
      </span>
    </div>
  );
}
