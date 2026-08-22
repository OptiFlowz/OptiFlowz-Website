"use client";

import { useEffect, useRef } from "react";
import type { ArticleItem } from "@/types";
import BlogArticleCard from "./blogArticleCard";

type BlogFeaturedCardMotionProps = {
  article: ArticleItem;
};

export default function BlogFeaturedCardMotion({ article }: BlogFeaturedCardMotionProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateCard = () => {
      frame = 0;

      if (reducedMotion.matches) {
        card.style.setProperty("--blog-featured-scale", "1");
        return;
      }

      const rect = card.getBoundingClientRect();
      const travel = Math.max(window.innerHeight * 0.7, rect.height * 1.2);
      const progress = Math.min(1, window.scrollY / travel);
      const eased = progress * progress * (3 - 2 * progress);
      const minimumScale = window.innerWidth < 700 ? 0.94 : 0.88;
      const scale = 1 - (1 - minimumScale) * eased;

      card.style.setProperty("--blog-featured-scale", scale.toFixed(4));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateCard);
    };

    const resizeObserver = new ResizeObserver(requestUpdate);
    resizeObserver.observe(card);
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
  }, []);

  return (
    <div ref={cardRef} className="blog-featured-motion">
      <BlogArticleCard article={article} featured />
    </div>
  );
}
