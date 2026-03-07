import { getArticleData } from "@/lib/articles";
import { ArticleItem } from "@/types";
import FadeInOnScroll from "../components/fadeInOnScroll";

type Props = {
    params: Promise<{articleSlug: ArticleItem["id"]}>
}

export default async function Article({params}: Props){
    const articleSlug = (await params).articleSlug;
    const articleData = await getArticleData(articleSlug);
    
    return(
        <main className="article-main">
            <FadeInOnScroll threshold={0} className="flex flex-col items-center">
                <article dangerouslySetInnerHTML={{__html: articleData.contentHtml}} />
            </FadeInOnScroll>
        </main>
    )
}