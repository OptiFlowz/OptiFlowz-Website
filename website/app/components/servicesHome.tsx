"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export default function ServicesHome() {
  const sectionRef = useRef<HTMLElement>(null);

  const totalImages = 3;
  const [inView, setInView] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const visible = useMemo(() => inView && loadedCount >= totalImages, [inView, loadedCount]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // make sure we don't over-increment if something re-renders
  const markLoaded = useRef(new Set<string>());
  const onImgDone = (key: string) => {
    if (markLoaded.current.has(key)) return;
    markLoaded.current.add(key);
    setLoadedCount((c) => c + 1);
  };

  return (
    <section className="services" ref={sectionRef}>
      {/* Left — appears 3rd (delay 2) */}
      <div
        className={`service-item ${visible ? "visible" : ""}`}
        style={{ transitionDelay: visible ? "0.2s" : "0s" }}
      >
        <Image
          src="/videocam.webp"
          alt="Custom Video Platforms"
          width={100}
          height={100}
          style={{ width: "80px", height: "80px" }}
          priority
          onLoadingComplete={() => onImgDone("videocam")}
        />
        <h2>Custom Video Platforms</h2>
        <p>
          Enterprise-grade streaming solutions tailored to your brand. From
          corporate training to global distribution, we build high-performance
          platforms that scale.
        </p>
      </div>

      {/* Center — appears 1st (no delay) */}
      <div
        className={`service-item accentService ${visible ? "visible" : ""}`}
        style={{ transitionDelay: "0s" }}
      >
        <Image
          src="/webdesign.webp"
          alt="Web Design & Development"
          width={100}
          height={100}
          style={{ width: "80px", height: "80px" }}
          priority
          onLoadingComplete={() => onImgDone("webdesign")}
        />
        <h2>Web Design &amp; Development</h2>
        <p>
          Modern, responsive websites built with cutting-edge technology. From
          landing pages to complex web applications, we bring your vision to life.
        </p>
      </div>

      {/* Right — appears 2nd (delay 1) */}
      <div
        className={`service-item ${visible ? "visible" : ""}`}
        style={{ transitionDelay: visible ? "0.1s" : "0s" }}
      >
        <Image
          src="/automation.webp"
          alt="Business Automation"
          width={100}
          height={100}
          style={{ width: "80px", height: "80px" }}
          priority
          onLoadingComplete={() => onImgDone("automation")}
        />
        <h2>Business Automation</h2>
        <p>
          Streamline your workflows and eliminate repetitive tasks. We create
          custom automation solutions that save time and reduce costs.
        </p>
      </div>
    </section>
  );
}