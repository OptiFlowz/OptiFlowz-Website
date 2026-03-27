import { ArticleItem } from "@/types";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "articles");

function parseArticleDate(date: string): number {
    const [day, month, year] = date.split("-").map(Number);

    if (!day || !month || !year) {
        return 0;
    }

    return new Date(year, month - 1, day).getTime();
}

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
        const timeA = parseArticleDate(a.date);
        const timeB = parseArticleDate(b.date);

        return timeB - timeA;
    });
}

export function getCatogorisedArticles(category?: string): Record<string, ArticleItem[]> {
    const sortedArticles = getSortedArticles();
    const categorisedArticles: Record<string, ArticleItem[]> = {};

    sortedArticles.forEach((article) => {
        if(category && article.category !== category)
            return;

        if (!categorisedArticles[article.category]) {
            categorisedArticles[article.category] = [];
        }

        categorisedArticles[article.category].push(article);
    });
    
    return categorisedArticles;
}

export async function getArticleData(id: ArticleItem["id"]): Promise<{
    id: ArticleItem["id"]; contentHtml: string; category: string}> {
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
        category: matterResult.data.category,
        ...matterResult.data,
    };
}