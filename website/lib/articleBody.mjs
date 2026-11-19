import { remark } from "remark";

/** @param {string} content @param {{ date: string, banner: string, title: string }} metadata */
export function parseArticleBody(content, metadata) {
    const document = remark().parse(content);
    const blocks = document.children;

    // Existing posts open with a title, a display date and a standalone cover image.
    if (blocks[0]?.type === "heading" && blocks[0].depth === 1) blocks.shift();
    const dateHeading = blocks.at(0);
    let displayDate = metadata.date;
    if (dateHeading?.type === "heading" && dateHeading.depth === 3 &&
        dateHeading.children.length === 1 && dateHeading.children[0].type === "text" &&
        /^\d{1,2}\.?\s+[A-Za-z]+\s+\d{4}$/.test(dateHeading.children[0].value)) {
        displayDate = dateHeading.children[0].value;
        blocks.shift();
    }
    const firstBlock = blocks.at(0);
    let cover = { src: metadata.banner, alt: metadata.title };
    if (firstBlock?.type === "paragraph" && firstBlock.children.length === 1 &&
        firstBlock.children[0].type === "image") {
        const image = firstBlock.children[0];
        cover = { src: image.url, alt: image.alt ?? "" };
        blocks.shift();
    }

    return { document, displayDate, cover };
}
