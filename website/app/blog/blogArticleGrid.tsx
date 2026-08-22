"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { ArticleItem } from "@/types";
import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import BlogArticleCard from "./blogArticleCard";

type BlogArticleGridProps = {
  articles: ArticleItem[];
};

export default function BlogArticleGrid({ articles }: BlogArticleGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      setColumns(window.innerWidth <= 650 ? 1 : window.innerWidth <= 1050 ? 2 : 3);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateRows = () => {
      frame = 0;
      const rows = grid.querySelectorAll<HTMLElement>(".blog-grid-row-motion");

      if (reducedMotion.matches) {
        rows.forEach((row) => row.style.setProperty("--blog-row-scale", "1"));
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      const travel = window.innerHeight * 0.65;
      const minimumScale = window.innerWidth < 700 ? 0.94 : 0.9;

      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const progress = Math.min(1, Math.max(0, (viewportCenter - rowCenter) / travel));
        const eased = progress * progress * (3 - 2 * progress);
        const scale = 1 - (1 - minimumScale) * eased;

        row.style.setProperty("--blog-row-scale", scale.toFixed(4));
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateRows);
    };

    const resizeObserver = new ResizeObserver(requestUpdate);
    resizeObserver.observe(grid);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);
    requestUpdate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [columns]);

  const articleRows: ArticleItem[][] = [];
  for (let index = 0; index < articles.length; index += columns) {
    articleRows.push(articles.slice(index, index + columns));
  }

  return (
    <div className="blog-grid" ref={gridRef}>
      {articleRows.map((row, rowIndex) => (
        <FadeInOnScroll
          key={row.map((article) => article.id).join("-")}
          delay={Math.min(rowIndex, 4) * 70}
          distance={22}
          initialScale={0.985}
        >
          <div
            className="blog-grid-row-motion"
            style={{ "--blog-grid-columns": columns } as CSSProperties}
          >
            <div className="blog-grid-row">
              {row.map((article) => (
                <BlogArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </FadeInOnScroll>
      ))}
    </div>
  );
}
