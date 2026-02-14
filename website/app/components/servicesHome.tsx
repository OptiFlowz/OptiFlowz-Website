"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export default function ServicesHome() {
  const sectionRef = useRef<HTMLElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  const totalImages = 3;
  const [inView, setInView] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // kad su sve slike učitane + sekcija u view
  const visible = useMemo(
    () => inView && loadedCount >= totalImages,
    [inView, loadedCount]
  );

  // float krene tek POSLE ulazne tranzicije
  const [floatOn, setFloatOn] = useState(false);
  const floatStarted = useRef(false);

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

  // helper: "0.6s, 120ms" -> max u ms
  const parseMaxTimeMs = (cssValue: string) => {
    const parts = cssValue.split(",").map((s) => s.trim()).filter(Boolean);
    const toMs = (v: string) => (v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
    return parts.length ? Math.max(...parts.map(toMs)) : 0;
  };

  useEffect(() => {
    // reset ako ikad postane false (u tvom slučaju verovatno neće, ali nek bude čisto)
    if (!visible) {
      setFloatOn(false);
      floatStarted.current = false;
      return;
    }

    const node = accentRef.current;
    if (!node) return;

    // uzmi stvarno trajanje tranzicije sa elementa (iz CSS-a)
    const cs = window.getComputedStyle(node);
    const dur = parseMaxTimeMs(cs.transitionDuration || "0s");
    const del = parseMaxTimeMs(cs.transitionDelay || "0s");
    const total = dur + del;

    // fallback: start posle total ms (radi čak i ako transitionend ne okine)
    const t = window.setTimeout(() => {
      if (floatStarted.current) return;
      floatStarted.current = true;
      setFloatOn(true);
    }, total + 30);

    // dodatno: ako transitionend ipak okine, kreni odmah (ali samo za taj element)
    const onEnd = (e: TransitionEvent) => {
      if (e.target !== node) return; // ignoriši children
      if (floatStarted.current) return;

      // najčešće ulazak animira transform/opacity
      if (e.propertyName !== "transform" && e.propertyName !== "opacity") return;

      floatStarted.current = true;
      setFloatOn(true);
      window.clearTimeout(t);
    };

    node.addEventListener("transitionend", onEnd);
    return () => {
      window.clearTimeout(t);
      node.removeEventListener("transitionend", onEnd);
    };
  }, [visible]);

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
          onLoad={() => onImgDone("videocam")}
        />
        <h2>Custom Video Platforms</h2>
        <p>
          Enterprise-grade streaming solutions tailored to your brand. From
          corporate training to global distribution, we build high-performance
          platforms that scale.
        </p>
      </div>

      {/* Center — appears 1st (no delay), float kreće posle tranzicije */}
      <div
        ref={accentRef}
        className={`service-item accentService ${visible ? "visible" : ""} ${
          floatOn ? "floating" : ""
        }`}
        style={{ transitionDelay: "0s" }}
      >
        <Image
          src="/webdesign.webp"
          alt="Web Design & Development"
          width={100}
          height={100}
          style={{ width: "80px", height: "80px" }}
          priority
          onLoad={() => onImgDone("webdesign")}
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
          onLoad={() => onImgDone("automation")}
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