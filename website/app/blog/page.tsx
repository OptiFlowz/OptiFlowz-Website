import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";
import { getCatogorisedArticles } from "@/lib/articles";
import ArticleListItem from "../article/articleListItem";

export const metadata: Metadata = {
  title: "Blog",
  description: "OptiFlowz Blog - Stay updated with the latest news, insights, and updates from OptiFlowz. Explore our blog for in-depth articles, industry trends, and expert opinions on optimization solutions. Join the conversation and discover how OptiFlowz is shaping the future of optimization technology.",
};

type Props = {
    searchParams: Promise<{category: string}>;
}

export default async function Blog({searchParams}: Props) {
    const searchedCategory = (await searchParams).category;

    const articlesByCategory = getCatogorisedArticles(searchedCategory);
    const articles = Object.values(articlesByCategory)
        .flat()
        .sort((a, b) => {
            const [dayA, monthA, yearA] = a.date.split("-").map(Number);
            const [dayB, monthB, yearB] = b.date.split("-").map(Number);

            return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime();
        });

    return(
        <main className="pp-main">
            <FadeInOnScroll>
                <h1 className="mainTitlePP">{searchedCategory ? `Category: ${searchedCategory}` : "Blog"}</h1>
                <p>Read our latest news and updates</p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={100} threshold={0}>
                <section className="blogSection">
                    <p>Latest posts</p>
                    <div className="articleList">
                        {articles.map((article, index) => (
                            <FadeInOnScroll key={article.id} delay={index * 100}>
                                <ArticleListItem key={article.id} props={article} />
                            </FadeInOnScroll>
                        ))}
                    </div>
                </section>
            </FadeInOnScroll>
        </main>
    )
}
