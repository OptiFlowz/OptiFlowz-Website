"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function VideoPlatformFeatures({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // The timeline intro also uses project-card-wrapper. Select the first
    // wrapper containing a full card, including its heading, image and text.
    const firstFeature = container.querySelector<HTMLElement>(
      ".projects-content > .project-card-wrapper > .project-card",
    )?.parentElement;
    if (!firstFeature) return;

    const measure = () => {
      // Layout offsets ignore the timeline's entrance transforms and scaling.
      let bottom = firstFeature.offsetHeight;
      let node: HTMLElement | null = firstFeature;
      while (node && node !== container) {
        bottom += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      if (node === container) {
        container.style.setProperty("--video-platform-first-feature-bottom", `${bottom}px`);
      }
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(firstFeature);
    const intro = container.querySelector<HTMLElement>(".projects-intro");
    if (intro) observer.observe(intro);
    measure();

    return () => {
      observer.disconnect();
      container.style.removeProperty("--video-platform-first-feature-bottom");
    };
  }, []);

  return (
    <div ref={containerRef} className="video-platform-features">
      <div className="grid-wrapper video-platform-features-grid" aria-hidden="true">
        <span />
        <span />
      </div>
      {children}
    </div>
  );
}
