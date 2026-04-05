"use client";

import { useEffect, useRef, useState } from "react";

type FadeInSide = "top" | "right" | "bottom" | "left";

const getHiddenTransforms = (distance: number): Record<FadeInSide, string> => ({
  top: `translateY(-${distance}px)`,
  right: `translateX(${distance}px)`,
  bottom: `translateY(${distance}px)`,
  left: `translateX(-${distance}px)`,
});

const defaultDistance = 40;
const defaultScale = 0.96;

type FadeInOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  side?: FadeInSide;
  distance?: number;
  initialScale?: number;
};

export default function FadeInOnScroll({
  children,
  className = "",
  threshold = 0.15,
  delay = 0, // ms (applies only if element is visible on initial load)
  side = "bottom",
  distance = defaultDistance,
  initialScale = defaultScale,
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const hiddenTransforms = getHiddenTransforms(distance);

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
        transform: visible ? "translate(0, 0) scale(1)" : `${hiddenTransforms[side]} scale(${initialScale})`,
        transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={`fade-in-section w-full relative ${visible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
