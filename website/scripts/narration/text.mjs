import { createHash } from "node:crypto";
import { parseArticleBody } from "../../lib/articleBody.mjs";

export const model = "onnx-community/Kokoro-82M-v1.0-ONNX";
export const voice = "af_heart";
export const bitrate = 64;

function plainText(node) {
    if (node.type === "text" || node.type === "inlineCode") return node.value;
    if (node.type === "break") return " ";
    return (node.children ?? []).map(plainText).join("");
}

function paragraphs(node) {
    if (node.type === "paragraph" || node.type === "heading") return [plainText(node)];
    return (node.children ?? []).flatMap(paragraphs);
}

export function narrationFor(slug, article) {
    const { document } = parseArticleBody(article.content, article.data);
    const segments = new Intl.Segmenter("en", { granularity: "sentence" });
    const chunks = [];
    for (const paragraph of paragraphs(document)) {
        const spoken = paragraph.replace(/OptiFlowz/gi, "Opti Flows")
            .replace(/\b\d+\.\d+\.\d+\b/g, version => version.replaceAll(".", " point "))
            .replace(/\s+/g, " ").trim();
        for (const { segment } of segments.segment(spoken)) {
            // Keep long sentences within the model's phoneme context.
            let chunk = "";
            for (const word of segment.trim().split(/\s+/)) {
                if (chunk.length + word.length > 260 && chunk) {
                    chunks.push(chunk);
                    chunk = "";
                }
                chunk = chunk ? `${chunk} ${word}` : word;
            }
            if (chunk) chunks.push(chunk);
        }
    }
    const hash = createHash("sha256").update(JSON.stringify([model, voice, bitrate, chunks])).digest("hex").slice(0, 12);
    return { chunks, file: `${slug}.${hash}.mp3` };
}
