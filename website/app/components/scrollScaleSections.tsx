"use client";

import { useEffect } from "react";

export default function ScrollScaleSections() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-scale-section"),
    );
    if (!sections.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateSections = () => {
      frame = 0;

      if (reducedMotion.matches) {
        sections.forEach((section) =>
          section.style.setProperty("--scroll-section-scale", "1"),
        );
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      const travel = window.innerHeight * 0.65;
      const minimumScale = window.innerWidth < 700 ? 0.94 : 0.9;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const progress = Math.min(
          1,
          Math.max(0, (viewportCenter - sectionCenter) / travel),
        );
        const eased = progress * progress * (3 - 2 * progress);
        const scale = 1 - (1 - minimumScale) * eased;

        section.style.setProperty("--scroll-section-scale", scale.toFixed(4));
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateSections);
    };

    const resizeObserver = new ResizeObserver(requestUpdate);
    sections.forEach((section) => resizeObserver.observe(section));
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);
    requestUpdate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
