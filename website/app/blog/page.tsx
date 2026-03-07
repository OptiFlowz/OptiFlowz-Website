import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";
import { getCatogorisedArticles } from "@/lib/articles";
import ArticleList from "../article/articleList";
import ArticleListItem from "../article/articleListItem";

export const metadata: Metadata = {
  title: "OptiFlowz - Blog",
  description: "OptiFlowz Blog - Stay updated with the latest news, insights, and updates from OptiFlowz. Explore our blog for in-depth articles, industry trends, and expert opinions on optimization solutions. Join the conversation and discover how OptiFlowz is shaping the future of optimization technology.",
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
                    <div className="articleList">
                        {articles !== null && 
                        // Object.keys(articles).map(article => (
                        //     <ArticleList key={article} props={{category: article, articles: articles[article]}} />  
                        // ))}
                        Object.keys(articles).map((category, catIndex) => (
                            articles[category].map((article, index) => (
                                console.log(index),
                                <FadeInOnScroll key={article.id} delay={(index+catIndex) * 100}>
                                    <ArticleListItem key={article.id} props={article} />
                                </FadeInOnScroll>
                            ))
                        ))}
                    </div>
                </section>
            </FadeInOnScroll>
        </main>
    )
}