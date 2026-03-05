import { ArticleItem } from "@/types";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "articles");

function getSortedArticles(): ArticleItem[] {
    const fileNames = fs.readdirSync(articlesDirectory);

    const allArticlesData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, "");
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);

        return {
            id,
            ...matterResult.data,
        } as ArticleItem;
    });

    return allArticlesData.sort((a, b) => {
        if (a.date < b.date) {
            return -1;
        } else if(a.date > a.date){
            return 1;
        }

        return 0;
    });
}

export function getCatogorisedArticles(): Record<string, ArticleItem[]> {
    const sortedArticles = getSortedArticles();
    const categorisedArticles: Record<string, ArticleItem[]> = {};

    sortedArticles.forEach((article) => {
        if (!categorisedArticles[article.category]) {
            categorisedArticles[article.category] = [];
        }

        categorisedArticles[article.category].push(article);
    });
    
    return categorisedArticles;
}

export async function getArticleData(id: ArticleItem["id"]) {
    const fullPath = path.join(articlesDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    const processed = await remark()
        .use(html)
        .process(matterResult.content);

    const htmlContent = processed.toString();

    return {
        id,
        contentHtml: htmlContent,
        ...matterResult.data,
    };
}