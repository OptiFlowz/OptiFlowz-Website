"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type BlogCategoryFiltersProps = {
  categories: string[];
  selectedCategory?: string;
};

export default function BlogCategoryFilters({
  categories,
  selectedCategory,
}: BlogCategoryFiltersProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLElement>(null);
  const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: false });

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    setScrollState({
      canScrollLeft: scroller.scrollLeft > 2,
      canScrollRight: scroller.scrollLeft < maxScrollLeft - 2,
    });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateScrollState();
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scroller);

    return () => resizeObserver.disconnect();
  }, [updateScrollState]);

  useEffect(() => {
    if (window.location.hash !== "#blog-categories") return;

    const alignmentTimeout = window.setTimeout(() => {
      shellRef.current?.scrollIntoView({ block: "start" });
    }, 520);

    return () => window.clearTimeout(alignmentTimeout);
  }, [selectedCategory]);

  const scrollFilters = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.max(260, scroller.clientWidth * 0.68),
      behavior: "smooth",
    });
  };

  return (
    <div ref={shellRef} className="blog-filter-shell" id="blog-categories">
      <button
        type="button"
        className="blog-filter-arrow blog-filter-arrow-left"
        aria-label="Scroll categories left"
        disabled={!scrollState.canScrollLeft}
        onClick={() => scrollFilters(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 6-6 6 6 6" />
        </svg>
      </button>

      <nav
        ref={scrollerRef}
        className="blog-filters"
        aria-label="Filter articles by category"
        onScroll={updateScrollState}
      >
        <Link
          href="/blog#blog-categories"
          className={!selectedCategory ? "is-active" : ""}
          aria-current={!selectedCategory ? "page" : undefined}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={{ pathname: "/blog", query: { category }, hash: "blog-categories" }}
            className={selectedCategory === category ? "is-active" : ""}
            aria-current={selectedCategory === category ? "page" : undefined}
          >
            {category}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="blog-filter-arrow blog-filter-arrow-right"
        aria-label="Scroll categories right"
        disabled={!scrollState.canScrollRight}
        onClick={() => scrollFilters(1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
