import { getArticleData } from "@/lib/articles";
import { ArticleItem } from "@/types";

type Props = {
    params: Promise<{articleSlug: ArticleItem["id"]}>
}

export default async function Article({params}: Props){
    const articleSlug = (await params).articleSlug;
    const articleData = await getArticleData(articleSlug);
    
    return(
        <main className="pp-main">
            <article dangerouslySetInnerHTML={{__html: articleData.contentHtml}} />
        </main>
    )
}