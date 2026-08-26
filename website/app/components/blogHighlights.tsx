import BlogArticleCard from "@/app/blog/blogArticleCard";
import { ArrowSVG } from "@/app/constants";
import { getShowcaseArticles } from "@/lib/articles";
import Link from "next/link";
import FadeInOnScroll from "./fadeInOnScroll";

type BlogHighlightsProps = {
  className?: string;
};

export default function BlogHighlights({ className = "" }: BlogHighlightsProps) {
  const articles = getShowcaseArticles();

  return (
    <section className={`about-journal-section scroll-scale-section ${className}`.trim()}>
      <FadeInOnScroll distance={18} initialScale={0.99}>
        <div className="about-section-heading">
          <div>
            <span className="about-eyebrow">From Our Blog</span>
          </div>
          <Link className="about-text-link blog-highlights-link noLineHover" href="/blog">
            View all articles {ArrowSVG}
          </Link>
        </div>
      </FadeInOnScroll>

      <div className="about-journal-grid">
        {articles.map((article, index) => (
          <FadeInOnScroll
            key={article.id}
            className="scroll-scale-mobile-item"
            delay={index * 70}
            distance={22}
            initialScale={0.98}
          >
            <BlogArticleCard article={article} />
          </FadeInOnScroll>
        ))}
      </div>
    </section>
  );
}
