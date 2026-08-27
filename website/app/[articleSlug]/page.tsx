import { articleExists, getArticleData, getArticleIds } from "@/lib/articles";
import { ArticleData, ArticleItem } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FadeInOnScroll from "../components/fadeInOnScroll";

const siteUrl = "https://optiflowz.com";

type Props = {
    params: Promise<{articleSlug: ArticleItem["id"]}>
}

function getPublishedTime(date: string): string | undefined {
    const [day, month, year] = date.split("-").map(Number);

    if (!day || !month || !year) return undefined;

    return new Date(Date.UTC(year, month - 1, day)).toISOString();
}

function getArticleDescription(article: ArticleData): string {
    return article.seoDescription ?? article.excerpt ??
        `Read ${article.title}, an OptiFlowz article about ${article.category}.`;
}

function getAbsoluteUrl(url: string): string {
    return new URL(url, siteUrl).toString();
}

export function generateStaticParams() {
    return getArticleIds().map((articleSlug) => ({ articleSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const articleSlug = (await params).articleSlug;

    if (!articleExists(articleSlug)) {
        return {
            title: "Article not found",
            robots: { index: false, follow: false },
        };
    }

    const article = await getArticleData(articleSlug);
    const title = article.seoTitle ?? article.title;
    const description = getArticleDescription(article);
    const canonicalPath = `/${article.id}`;
    const publishedTime = getPublishedTime(article.date);
    const socialImage = {
        url: article.banner,
        alt: article.title,
    };

    return {
        title,
        description,
        authors: [{ name: "OptiFlowz", url: "/about-us" }],
        creator: "OptiFlowz",
        publisher: "OptiFlowz",
        category: article.category,
        keywords: [article.category, "OptiFlowz", "digital platforms", "business technology"],
        alternates: {
            canonical: canonicalPath,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        },
        openGraph: {
            type: "article",
            title,
            description,
            url: canonicalPath,
            siteName: "OptiFlowz",
            locale: "en_US",
            publishedTime,
            authors: ["OptiFlowz"],
            section: article.category,
            images: [socialImage],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [socialImage],
        },
    };
}

export default async function Article({params}: Props){
    const articleSlug = (await params).articleSlug;

    if (!articleExists(articleSlug)) {
        notFound();
    }

    const articleData = await getArticleData(articleSlug);
    const description = getArticleDescription(articleData);
    const publishedTime = getPublishedTime(articleData.date);
    const articleUrl = getAbsoluteUrl(`/${articleData.id}`);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: articleData.title,
        description,
        image: getAbsoluteUrl(articleData.banner),
        datePublished: publishedTime,
        dateModified: publishedTime,
        mainEntityOfPage: articleUrl,
        author: {
            "@type": "Organization",
            name: "OptiFlowz",
            url: siteUrl,
        },
        publisher: {
            "@type": "Organization",
            name: "OptiFlowz",
            url: siteUrl,
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/logo.webp`,
            },
        },
    };
    
    const addCategotyTag = () => {
        const categoryHref = `/blog?category=${encodeURIComponent(articleData.category)}#blog-categories`;

        return articleData.contentHtml
            .replace(
                /<\/h1>/,
                `</h1><div class="article-meta" style="display:flex;align-items:center;flex-wrap:wrap;gap:.75rem;margin-top:9px"><a href="${categoryHref}" class="article-category" style="margin:0">Category: ${articleData.category}</a>`
            )
            .replace(/<h3>/, '<h3 style="margin:0">')
            .replace(/<\/h3>/, "</h3></div>");
    }

    return(
        <main className="article-main">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <FadeInOnScroll threshold={0} className="flex flex-col items-center">
                <article dangerouslySetInnerHTML={{__html: addCategotyTag()}} />
            </FadeInOnScroll>
        </main>
    )
}
