"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowSVG } from "../constants";

const DownArrowSVG = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5V19M12 19L18 13M12 19L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

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

  return (
    <section className={`hero ${isLoaded ? "is-loaded" : ""}`}>
      <div className="hero-content">
        <h1>
          Build Smarter.
          <br />
          Automate Faster.
          <br />
          Scale with <span className="accentText">OptiFlowz</span>
        </h1>

        <p>
          Custom video platforms, websites, and digital experiences built to
          help businesses educate, engage, and grow.
        </p>

        <div className="hero-actions">
          <Link href="#contactForm" className="button">
            Get in Contact {ArrowSVG}
          </Link>
          <Link href="#projects" className="button white">
            Our projects {DownArrowSVG}
          </Link>
        </div>
      </div>

      <div className="hero-media" aria-hidden="true">
        <Image
          src="/HeroBanner-v4.webp"
          alt=""
          fill
          sizes="(max-width: 800px) 1px, 900px"
          priority
        />
      </div>
    </section>
  );
}
