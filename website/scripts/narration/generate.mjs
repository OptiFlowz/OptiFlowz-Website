import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { bitrate, model, narrationFor, voice } from "./text.mjs";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(toolsDir, "../..");
const output = path.join(root, "public/article-audio");
mkdirSync(output, { recursive: true });
const manifest = {};
let synthesizer;
let Mp3Encoder;

async function render(chunks, destination) {
    if (!synthesizer) {
        if (!existsSync(path.join(toolsDir, "node_modules/kokoro-js"))) {
            execFileSync("npm", ["ci", "--no-audit", "--no-fund"], {
                cwd: toolsDir, stdio: "inherit",
                env: { ...process.env, ONNXRUNTIME_NODE_INSTALL_CUDA: "skip" },
            });
        }
        const { KokoroTTS } = await import("kokoro-js");
        ({ Mp3Encoder } = await import("@breezystack/lamejs"));
        synthesizer = await KokoroTTS.from_pretrained(model, { dtype: "q8", device: "cpu" });
    }
    const encoder = new Mp3Encoder(1, 24000, bitrate);
    const frames = [];
    for (const chunk of chunks) {
        const { audio } = await synthesizer.generate(chunk, { voice });
        const pcm = Int16Array.from(audio, n => Math.round(Math.max(-1, Math.min(1, n)) * 32767));
        frames.push(Buffer.from(encoder.encodeBuffer(pcm)));
    }
    frames.push(Buffer.from(encoder.flush()));
    const temp = `${destination}.${process.pid}.tmp`;
    writeFileSync(temp, Buffer.concat(frames));
    renameSync(temp, destination);
}

for (const name of readdirSync(path.join(root, "articles")).sort()) {
    if (!name.endsWith(".md")) continue;
    const slug = name.slice(0, -3);
    const article = matter(readFileSync(path.join(root, "articles", name), "utf8"));
    const { file, chunks } = narrationFor(slug, article);
    const destination = path.join(output, file);
    if (!existsSync(destination)) {
        console.log(`Narrating ${slug}`);
        await render(chunks, destination);
    }
    // These mono MP3s have a constant bitrate and no tags or artwork.
    manifest[slug] = { src: `/article-audio/${file}`, duration: statSync(destination).size / (bitrate * 125) };
}
const manifestPath = path.join(root, "lib/articleAudio.json");
const json = JSON.stringify(manifest, null, 2) + "\n";
if (!existsSync(manifestPath) || readFileSync(manifestPath, "utf8") !== json) {
    const temp = `${manifestPath}.${process.pid}.tmp`;
    writeFileSync(temp, json);
    renameSync(temp, manifestPath);
}
