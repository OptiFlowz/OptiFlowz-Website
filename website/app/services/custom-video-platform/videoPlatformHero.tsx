"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { ArrowSVG } from "@/app/constants";
import MacbookShowcase from "./macbookShowcase";

export default function VideoPlatformHero() {
  preload("/models/macbook/macbook-pro-14.ccd3d18d.glb", { as: "fetch", crossOrigin: "anonymous" });
  const heroRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCopyReady, setIsCopyReady] = useState(false);

  useEffect(() => {
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setIsLoaded(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !actionsRef.current) return;
    // Overlap the laptop entrance with the last 250ms of the button animation.
    // Derive timing from CSS so reduced motion still reveals it immediately.
    const style = getComputedStyle(actionsRef.current);
    const toMilliseconds = (value: string) => Number.parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1000);
    const durations = style.transitionDuration.split(",").map(toMilliseconds);
    const delays = style.transitionDelay.split(",").map(toMilliseconds);
    const duration = Math.max(...durations.map((value, index) => value + delays[index % delays.length]));
    const timeout = window.setTimeout(() => setIsCopyReady(true), Math.max(0, duration - 250));
    return () => window.clearTimeout(timeout);
  }, [isLoaded]);

  return (
    <section ref={heroRef} className={`video-platform-hero ${isLoaded ? "is-loaded" : ""}`}>
      <div className="video-platform-hero-copy">
        <h1>OptiFlowz Video Platform</h1>
        <p className="video-platform-lede">
          A secure, fully branded home for training, communication, and content,
          built around your audience and managed end to end by OptiFlowz.
        </p>
        <div ref={actionsRef} className="video-platform-actions" onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === "transform") setIsCopyReady(true);
        }}>
          <Link
            className="button noLineHover"
            href="https://videoplatform.optiflowz.com/"
            target="_blank"
            rel="noreferrer"
          >
            Try the platform{ArrowSVG}
          </Link>
          <Link
            className="button white noLineHover"
            href="/services/custom-video-platform/release-notes"
          >
            View release notes{ArrowSVG}
          </Link>
        </div>
      </div>

      <div className="video-platform-sticky">
        <MacbookShowcase heroRef={heroRef} revealAllowed={isCopyReady} />
      </div>
    </section>
  );
}
