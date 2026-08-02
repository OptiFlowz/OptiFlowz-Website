import { ArticleItem } from "@/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
    props: ArticleItem
};

export default function ArticleListItem({props}: Props) {
  return (
    <Link href={`/${props.id}`} className="articleItem noLineHover">
        <Image
          src={props.banner}
          alt={props.title}
          width={800}
          height={450}
          sizes="(max-width: 650px) calc(100vw - 40px), 250px"
        />
        <div>
            <h3>{props.title}</h3>
            <span>{props.category}</span>
            <p>{props.date}</p>
        </div>
    </Link>
  );
}
