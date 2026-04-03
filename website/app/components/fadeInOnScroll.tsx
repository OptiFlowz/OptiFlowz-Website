"use client";

import { useEffect, useRef, useState } from "react";

type FadeInSide = "top" | "right" | "bottom" | "left";

const hiddenTransforms: Record<FadeInSide, string> = {
  top: "translateY(-40px)",
  right: "translateX(40px)",
  bottom: "translateY(40px)",
  left: "translateX(-40px)",
};

export default function FadeInOnScroll({
  children,
  className = "",
  threshold = 0.15,
  delay = 0, // ms (applies only if element is visible on initial load)
  side = "bottom",
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  side?: FadeInSide;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // If the element was ever observed as NOT intersecting,
  // we treat it as "came from scroll later" => no delay.
  const wasEverOutOfViewRef = useRef(false);
  const didAnimateRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (didAnimateRef.current) return;

        if (!entry.isIntersecting) {
          // We saw it out of view at least once (likely initial load below the fold)
          wasEverOutOfViewRef.current = true;
          return;
        }

        // If it was out of view at least once, show immediately.
        // Otherwise (visible on initial load), apply delay for stagger.
        const effectiveDelay = wasEverOutOfViewRef.current ? 0 : Math.max(0, delay);

        timeoutId = setTimeout(() => {
          didAnimateRef.current = true;
          setVisible(true);
          observer.disconnect(); // animate once
        }, effectiveDelay);
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [threshold, delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0, 0)" : hiddenTransforms[side],
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
      className={`fade-in-section w-full relative ${visible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
