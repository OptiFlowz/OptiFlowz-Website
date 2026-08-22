import type { ArticleItem } from "@/types";
import Image from "next/image";
import Link from "next/link";

type BlogArticleCardProps = {
  article: ArticleItem;
  featured?: boolean;
};

function getDateDetails(date: string) {
  const [day, month, year] = date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return {
    dateTime: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    label: new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(parsedDate),
  };
}

export default function BlogArticleCard({ article, featured = false }: BlogArticleCardProps) {
  const date = getDateDetails(article.date);

  return (
    <Link
      href={`/${article.id}`}
      className={`blog-card noLineHover${featured ? " blog-card-featured" : ""}`}
      aria-label={`Read ${article.title}`}
    >
      <div className="blog-card-image">
        <Image
          src={article.banner}
          alt=""
          width={1200}
          height={750}
          sizes={featured
            ? "(max-width: 800px) calc(100vw - 40px), 55vw"
            : "(max-width: 700px) calc(100vw - 40px), (max-width: 1050px) 50vw, 33vw"
          }
        />
        <span className="blog-card-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
      </div>

      <article className="blog-card-content">
        <div className="blog-card-meta">
          <time dateTime={date.dateTime}>{date.label}</time>
        </div>
        <h2>{article.title}</h2>
        {article.excerpt && <p>{article.excerpt}</p>}
        <span className="blog-card-category">{article.category}</span>
      </article>
    </Link>
  );
}
