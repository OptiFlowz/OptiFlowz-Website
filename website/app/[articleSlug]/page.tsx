import { articleExists, getArticleData } from "@/lib/articles";
import { ArticleItem } from "@/types";
import { notFound } from "next/navigation";
import FadeInOnScroll from "../components/fadeInOnScroll";

type Props = {
    params: Promise<{articleSlug: ArticleItem["id"]}>
}

export default async function Article({params}: Props){
    const articleSlug = (await params).articleSlug;

    if (!articleExists(articleSlug)) {
        notFound();
    }

    const articleData = await getArticleData(articleSlug);
    
    const addCategotyTag = () => {
        const categoryHref = `/blog?category=${encodeURIComponent(articleData.category)}#blog-categories`;

        return articleData.contentHtml
            .replace(
                /<\/h1>/,
                `</h1><div class="article-meta" style="display:flex;align-items:center;flex-wrap:wrap;gap:.75rem;margin-top:9px"><a href="${categoryHref}" class="article-category" style="margin:0">Category: ${articleData.category}</a>`
            )
            .replace(/<h3>/, '<h3 style="margin:0">')
            .replace(/<\/h3>/, "</h3></div>");
    }

    return(
        <main className="article-main">
            <FadeInOnScroll threshold={0} className="flex flex-col items-center">
                <article dangerouslySetInnerHTML={{__html: addCategotyTag()}} />
            </FadeInOnScroll>
        </main>
    )
}
