import { ArticleItem } from "@/types";
import Link from "next/link";

type Props = {
    props: ArticleItem
};

export default function ArticleListItem({props}: Props) {
  return (
    <Link href={`/${props.id}`} className="articleItem noLineHover">
        <img src={props.banner} alt={props.title} />
        <div>
            <h3>{props.title}</h3>
            <span>{props.category.toLocaleLowerCase()}</span>
            <p>{props.date}</p>
        </div>
    </Link>
  );
}