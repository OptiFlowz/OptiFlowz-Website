import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="hero">
      <h1 className="hero-h1 visible">
        Build Smarter.
        <br />
        Automate Faster.
        <br />
        Scale with <span className="accentText">OptiFlowz</span>
      </h1>
      <Image
        className="hero-image visible"
        src="/heroImage.webp"
        alt="OptiFlowz digital automation illustration"
        width={500}
        height={500}
        style={{ width: "400px", height: "400px" }}
        sizes="(max-width: 800px) 1px, (max-width: 950px) 275px, (max-width: 1200px) 325px, 400px"
        priority
      />
    </section>
  );
}
