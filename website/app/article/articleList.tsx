import { ArticleItem } from "@/types";
import Link from "next/link";
import ArticleListItem from "./articleListItem";

type Props = {
    category: ArticleItem["category"],
    articles: ArticleItem[]
}

export default function ArticleList({props}: {props: Props}) {
    return(
        <div className="articleList">
            {props.articles.map((article) => (
                <ArticleListItem key={article.id} props={article} />            
            ))}
        </div>
    )
}