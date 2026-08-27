"use client";

import { useEffect } from "react";

export default function ScrollScaleSections() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-scale-section"),
    );
    if (!sections.length) return;

    const mobileItems = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-scale-mobile-item"),
    );

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const setScale = (element: HTMLElement, scale: string) => {
      const property = element.classList.contains("scroll-scale-mobile-item")
        ? "--scroll-item-scale"
        : "--scroll-section-scale";

      element.style.setProperty(property, scale);
    };

    const updateSections = () => {
      frame = 0;

      if (reducedMotion.matches || window.innerWidth <= 700) {
        sections.forEach((section) => setScale(section, "1"));
        mobileItems.forEach((item) => setScale(item, "1"));
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      const travel = window.innerHeight * 0.65;
      const minimumScale = 0.9;
      const targets: HTMLElement[] = [];

      sections.forEach((section) => {
        const sectionItems = Array.from(
          section.querySelectorAll<HTMLElement>(".scroll-scale-mobile-item"),
        );

        sectionItems.forEach((item) => setScale(item, "1"));
        targets.push(section);
      });

      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        const targetCenter = rect.top + rect.height / 2;
        const progress = Math.min(
          1,
          Math.max(0, (viewportCenter - targetCenter) / travel),
        );
        const eased = progress * progress * (3 - 2 * progress);
        const scale = 1 - (1 - minimumScale) * eased;

        setScale(target, scale.toFixed(4));
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateSections);
    };

    const resizeObserver = new ResizeObserver(requestUpdate);
    sections.forEach((section) => resizeObserver.observe(section));
    mobileItems.forEach((item) => resizeObserver.observe(item));
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
