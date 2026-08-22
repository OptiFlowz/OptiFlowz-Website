import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";
import { getCatogorisedArticles } from "@/lib/articles";
import Link from "next/link";
import BlogArticleGrid from "./blogArticleGrid";
import BlogFeaturedCardMotion from "./blogFeaturedCardMotion";
import BlogCategoryFilters from "./blogCategoryFilters";

export const metadata: Metadata = {
  title: "Blog",
  description: "OptiFlowz Blog - Stay updated with the latest news, insights, and updates from OptiFlowz. Explore our blog for in-depth articles, industry trends, and expert opinions on optimization solutions. Join the conversation and discover how OptiFlowz is shaping the future of optimization technology.",
};

type Props = {
    searchParams: Promise<{category: string}>;
}

export default async function Blog({searchParams}: Props) {
    const searchedCategory = (await searchParams).category;
    const allArticlesByCategory = getCatogorisedArticles();
    const categories = Object.keys(allArticlesByCategory).sort((a, b) => a.localeCompare(b));
    const allArticles = Object.values(allArticlesByCategory)
        .flat()
        .sort((a, b) => {
            const [dayA, monthA, yearA] = a.date.split("-").map(Number);
            const [dayB, monthB, yearB] = b.date.split("-").map(Number);

            return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime();
        });
    const featuredArticle = allArticles.find((article) => article.id === "why-fully-custom-video-platforms-win");
    const remainingArticles = allArticles.filter((article) => {
        if (article.id === featuredArticle?.id) return false;
        return !searchedCategory || article.category === searchedCategory;
    });

    return(
        <main className="pp-main blog-page">
            <FadeInOnScroll threshold={0} distance={24} initialScale={0.98}>
                <section className="blog-hero">
                    <div className="blog-hero-copy">
                        <h1 className="mainTitlePP">Blog</h1>
                        <p>Read our latest news and updates</p>
                    </div>
                    <div className="blog-publishing-schedule">
                        <strong>New article every Friday</strong>
                        <span>09:00 UTC</span>
                    </div>
                </section>
            </FadeInOnScroll>

            {featuredArticle ? (
                <FadeInOnScroll delay={80} threshold={0} distance={24} initialScale={0.985}>
                    <section className="blog-featured-section">
                        <div className="blog-section-heading">
                            <h2>Featured</h2>
                        </div>
                        <BlogFeaturedCardMotion article={featuredArticle} />
                    </section>
                </FadeInOnScroll>
            ) : null}

            <FadeInOnScroll delay={130} threshold={0} distance={18} initialScale={0.99}>
                <BlogCategoryFilters categories={categories} selectedCategory={searchedCategory} />
            </FadeInOnScroll>

            {remainingArticles.length > 0 ? (
                <section className="blog-index" id="latest-articles">
                    <div className="blog-section-heading">
                        <h2>{searchedCategory ? `Latest articles from ${searchedCategory}` : "Latest articles"}</h2>
                        <span>{remainingArticles.length} {remainingArticles.length === 1 ? "article" : "articles"}</span>
                    </div>
                    <BlogArticleGrid articles={remainingArticles} />
                </section>
            ) : (
                <section className="blog-empty-state" id="latest-articles">
                    <h2>No articles found</h2>
                    <p>There are no posts in this category yet.</p>
                    <Link href="/blog" className="button noLineHover">View all articles</Link>
                </section>
            )}

        </main>
    )
}
