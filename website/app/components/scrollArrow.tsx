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
  const rafRef = useRef<number>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const arrow = arrowRef.current;
    if (!wrapper || !arrow) return;

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

      rafRef.current = null;
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(update);
        ticking = true;
        // Reset ticking after frame
        setTimeout(() => {
          ticking = false;
        }, 0);
      }
    };

    window.addEventListener("scroll", onScroll);
    // Initial call to set position
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
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