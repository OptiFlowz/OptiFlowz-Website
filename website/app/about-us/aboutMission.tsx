"use client";

import { useEffect, useRef } from "react";

const mission =
  "We built OptiFlowz to make useful digital products with care: video platforms people enjoy learning on, websites people remember, and tools that make everyday work feel lighter.";

export default function AboutMission() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = Array.from(
      section.querySelectorAll<HTMLElement>(".about-mission-word"),
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const entryObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-entered");
        entryObserver.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );

    if (reducedMotion.matches) {
      section.classList.add("is-entered");
    } else {
      entryObserver.observe(section);
    }

    const updateProgress = () => {
      frame = 0;

      if (reducedMotion.matches) {
        words.forEach((word) =>
          word.style.setProperty("--mission-word-progress", "1"),
        );
        return;
      }

      const rect = section.getBoundingClientRect();
      const sticky = section.querySelector<HTMLElement>(
        ".about-mission-sticky",
      );
      const stickyTop = sticky
        ? Number.parseFloat(window.getComputedStyle(sticky).top) || 0
        : 0;
      const stickyHeight = sticky?.offsetHeight ?? 0;
      const pinDistance = Math.max(1, rect.height - stickyHeight);
      const progress = Math.min(
        1,
        Math.max(0, (stickyTop - rect.top) / pinDistance),
      );
      const revealPosition = progress * words.length;

      words.forEach((word, index) => {
        const wordProgress = Math.min(1, Math.max(0, revealPosition - index));
        word.style.setProperty(
          "--mission-word-progress",
          wordProgress.toFixed(3),
        );
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    const resizeObserver = new ResizeObserver(requestUpdate);
    resizeObserver.observe(section);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);
    requestUpdate();

    return () => {
      entryObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="about-mission" id="about-mission" ref={sectionRef}>
      <div className="about-mission-sticky">
        <span className="about-eyebrow">Our mission</span>
        <h2>
          {mission.split(" ").map((word, index, words) => (
            <span className="about-mission-word" key={`${word}-${index}`}>
              {word}
              {index < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
