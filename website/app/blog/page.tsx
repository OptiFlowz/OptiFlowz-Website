import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";
import { getCatogorisedArticles } from "@/lib/articles";
import ArticleList from "../article/articleList";
import ArticleListItem from "../article/articleListItem";

export const metadata: Metadata = {
  title: "OptiFlowz - Blog",
  description: "OptiFlowz is a web desgin and automation company - Learn more about us",
};

export default function Blog() {
    const articles = getCatogorisedArticles();

    return(
        <main className="pp-main">
            <FadeInOnScroll>
                <h1 className="mainTitlePP">Blog</h1>
                <p>Read our latest news and updates</p>
            </FadeInOnScroll>
            <FadeInOnScroll delay={100}>
                <section className="blogSection">
                    <p>Latest posts</p>
                    {articles !== null && 
                        // Object.keys(articles).map(article => (
                        //     <ArticleList key={article} props={{category: article, articles: articles[article]}} />  
                        // ))}
                        Object.keys(articles).map(category => (
                            articles[category].map(article => (
                                <ArticleListItem key={article.id} props={article} />
                            ))
                        ))}
                </section>
            </FadeInOnScroll>
        </main>
    )
}