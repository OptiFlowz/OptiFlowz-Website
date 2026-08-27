"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowSVG } from "@/app/constants";

export default function VideoPlatformHero() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMediaReady, setIsMediaReady] = useState(false);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateMedia = () => {
      frame = 0;

      if (reducedMotion.matches || window.innerWidth <= 700) {
        media.style.setProperty("--video-hero-scale", "1");
        media.style.setProperty("--video-hero-opacity", "1");
        media.style.setProperty("--video-hero-radius", "18px");
        return;
      }

      const rect = media.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const mediaCenter = rect.top + rect.height / 2;
      const travel = (window.innerHeight + rect.height) * 0.48;
      const proximity = Math.max(0, 1 - Math.abs(mediaCenter - viewportCenter) / travel);
      const eased = proximity * proximity * (3 - 2 * proximity);
      const minimumScale = 0.86;
      const scale = minimumScale + (1 - minimumScale) * eased;
      const hasPassedViewportCenter = mediaCenter < viewportCenter;
      const opacity = hasPassedViewportCenter
        ? 0.6 + Math.pow(eased, 1.2) * 0.4
        : 0.72 + eased * 0.28;

      media.style.setProperty("--video-hero-scale", scale.toFixed(4));
      media.style.setProperty("--video-hero-opacity", opacity.toFixed(3));
      media.style.setProperty("--video-hero-radius", `${Math.round(30 - eased * 12)}px`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateMedia);
    };

    const resizeObserver = new ResizeObserver(requestUpdate);
    resizeObserver.observe(media);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    requestUpdate();
    const readyFrame = window.requestAnimationFrame(() => setIsReady(true));

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      window.cancelAnimationFrame(readyFrame);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className={`video-platform-hero ${isReady ? "is-ready" : ""}`}>
      <div className="video-platform-hero-copy">
        <h1>OptiFlowz Video Platform</h1>
        <p className="video-platform-lede">
          A secure, fully branded home for training, communication, and content,
          built around your audience and managed end to end by OptiFlowz.
        </p>
        <div className="video-platform-actions">
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

      <div
        className={`video-platform-hero-media ${isMediaReady ? "is-loaded" : ""}`}
        ref={mediaRef}
      >
        <div className="video-platform-hero-media-frame">
          <Image
            src="/video-platform/optiflowz-video-platform-hero.webp"
            alt="A custom OptiFlowz video platform shown on a laptop"
            width={3000}
            height={1991}
            sizes="(max-width: 700px) 96vw, 1200px"
            priority
            onLoad={() => setIsMediaReady(true)}
          />
        </div>
      </div>
    </section>
  );
}
