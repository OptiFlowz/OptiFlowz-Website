"use client";

import { useEffect, useRef, type ReactNode } from "react";

type FooterRevealProps = {
  children: ReactNode;
};

export default function FooterReveal({ children }: FooterRevealProps) {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = revealRef.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      element.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        requestAnimationFrame(() => element.classList.add("is-visible"));
        observer.disconnect();
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -4% 0px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={revealRef} className="footer-reveal">
      {children}
    </div>
  );
}
