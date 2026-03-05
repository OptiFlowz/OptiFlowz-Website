import { ArticleItem } from "@/types";
import Link from "next/link";

type Props = {
    category: ArticleItem["category"],
    articles: ArticleItem[]
}

export default function ArticleList({props}: {props: Props}) {
    return(
        <div className="articleList">
            {props.articles.map((article) => (
                <Link key={article.id} href={`/${article.id}`} className="articleItem">
                    <img src={article.banner} alt={article.title} />      
                    <h3>{article.title}</h3>
                    <p>{article.date}</p>
                </Link>
            ))}
        </div>
    )
}