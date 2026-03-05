"use client";

import { useEffect, useRef, useState } from "react";

export default function FadeInOnScroll({
  children,
  className = "",
  threshold = 0.15,
  delay = 0, // ms (applies only if element is visible on initial load)
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
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
      className={`fade-in-section w-full relative ${visible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}