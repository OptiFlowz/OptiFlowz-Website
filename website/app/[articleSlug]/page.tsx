import { getArticleData } from "@/lib/articles";
import { ArticleItem } from "@/types";
import FadeInOnScroll from "../components/fadeInOnScroll";

type Props = {
    params: Promise<{articleSlug: ArticleItem["id"]}>
}

export default async function Article({params}: Props){
    const articleSlug = (await params).articleSlug;
    const articleData = await getArticleData(articleSlug);
    
    const addCategotyTag = () => {
        return articleData.contentHtml.replace(
            /<\/h1>/,
            `</h1><a href=${`/blog?category=${encodeURIComponent(articleData.category)}`} class="article-category">Category: ${articleData.category}</a>`
        );
    }

    return(
        <main className="article-main">
            <FadeInOnScroll threshold={0} className="flex flex-col items-center">
                <article dangerouslySetInnerHTML={{__html: addCategotyTag()}} />
            </FadeInOnScroll>
        </main>
    )
}