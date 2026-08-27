export type ArticleItem = {
    id: string,
    title: string,
    date: string,
    category: string,
    banner: string,
    excerpt?: string,
    seoTitle?: string,
    seoDescription?: string
}

export type ArticleData = ArticleItem & {
    contentHtml: string
}
