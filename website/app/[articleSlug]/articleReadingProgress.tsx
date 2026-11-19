"use client";

import { useEffect } from "react";

export default function ArticleReadingProgress() {
    useEffect(() => {
        const body = document.getElementById("article-body");
        const header = document.querySelector<HTMLElement>("header.siteHeader");
        if (!body || !header) return;

        let frame = 0;
        function update() {
            frame = 0;
            if (!body || !header) return;
            const text = body.getBoundingClientRect();
            const headerBottom = header.getBoundingClientRect().bottom;
            const distanceRead = headerBottom - text.top;
            const scrollRange = Math.max(1, text.height - (window.innerHeight - headerBottom));
            const progress = Math.min(1, Math.max(0, distanceRead / scrollRange));
            header.style.setProperty("--article-progress", String(progress));
        }

        function scheduleUpdate() {
            if (!frame) frame = requestAnimationFrame(update);
        }

        header.dataset.articleReading = "";
        update();
        const observer = new ResizeObserver(scheduleUpdate);
        observer.observe(body);
        observer.observe(header);
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);
        document.addEventListener("transitionend", scheduleUpdate);
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
            document.removeEventListener("transitionend", scheduleUpdate);
            cancelAnimationFrame(frame);
            delete header.dataset.articleReading;
            header.style.removeProperty("--article-progress");
        };
    }, []);

    return null;
}
