"use client";

import { useEffect, useState } from "react";

export default function AboutHero() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className={`about-hero ${isReady ? "is-ready" : ""}`}>
      <div className="about-hero-statement">
        <h1>We build video platforms for better learning</h1>
        <p>
          OptiFlowz designs and builds custom video platforms, modern websites,
          and business automation systems that help organizations educate,
          operate, and grow.
        </p>
      </div>
    </section>
  );
}
