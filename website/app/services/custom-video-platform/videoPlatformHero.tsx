"use client";

import Link from "next/link";
import { useRef } from "react";
import { preload } from "react-dom";
import { ArrowSVG } from "@/app/constants";
import MacbookShowcase from "./macbookShowcase";

export default function VideoPlatformHero() {
  preload("/models/macbook/macbook-pro-14.glb", { as: "fetch", crossOrigin: "anonymous" });
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section ref={heroRef} className="video-platform-hero">
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

      <div className="video-platform-sticky">
        <MacbookShowcase heroRef={heroRef} />
      </div>
    </section>
  );
}
