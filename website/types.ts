export type ArticleItem = {
    id: string,
    title: string,
    date: string,
    category: string,
    banner: string,
    bannerPoster?: string,
    excerpt?: string,
    seoTitle?: string,
    seoDescription?: string
}

export type ArticleData = ArticleItem & {
    displayDate: string,
    cover: { src: string, alt: string },
    contentHtml: string
}
