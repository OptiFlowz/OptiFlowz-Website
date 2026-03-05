import { getArticleData } from "@/lib/articles";
import { ArticleItem } from "@/types";
import FadeInOnScroll from "@/app/components/fadeInOnScroll";

type Props = {
    params: Promise<{articleSlug: ArticleItem["id"]}>
}

export default async function Article({params}: Props){
    const articleSlug = (await params).articleSlug;
    const articleData = await getArticleData(articleSlug);
    
    return(
        <main className="article-main">
            <FadeInOnScroll>
                <article dangerouslySetInnerHTML={{__html: articleData.contentHtml}} />
            </FadeInOnScroll>
        </main>
    )
}