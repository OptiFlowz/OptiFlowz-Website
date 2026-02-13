// app/components/HeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure DOM is painted, then trigger
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <section className="hero">
      <h1 className={`hero-h1 ${visible ? "visible" : ""}`}>
        Build Smarter.
        <br />
        Automate Faster.
        <br />
        Scale with <p className="accentText">OptiFlowz</p>
      </h1>
      <Image
        className={`hero-image ${visible ? "visible" : ""}`}
        src="/heroImage.webp"
        alt="Logo"
        width={500}
        height={500}
        style={{ width: "400px", height: "400px" }}
        priority
      />
    </section>
  );
}