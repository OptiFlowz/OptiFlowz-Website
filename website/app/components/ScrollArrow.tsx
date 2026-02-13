// app/components/ScrollArrow.tsx
"use client";

import { useEffect, useRef } from "react";
import { ArrowSVG } from "../constants";

export default function ScrollArrow({
  direction,
}: {
  direction: "left" | "right";
}) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const initialProgress = useRef<number | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const arrow = arrowRef.current;
    if (!wrapper || !arrow) return;

    let raf = 0;

    const getProgress = () => {
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      return Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1);
    };

    const update = () => {
      const rawProgress = getProgress();

      // Capture where progress starts on first frame
      if (initialProgress.current === null) {
        initialProgress.current = rawProgress;
      }

      // Normalize so it starts from 0
      const range = 1 - initialProgress.current;
      const progress =
        range > 0
          ? Math.min(
              Math.max(
                (rawProgress - initialProgress.current) / range,
                0
              ),
              1
            )
          : 0;

      const maxOffset = 200;
      const offset = progress * maxOffset;
      const translateX = direction === "left" ? -offset : offset;

      arrow.style.transform = `translateX(${translateX}px)`;

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [direction]);

  return (
    <span className="line-wrapper" ref={wrapperRef}>
      <span className="line"></span>
      <span className="arrow" ref={arrowRef}>
        {ArrowSVG}
      </span>
    </span>
  );
}