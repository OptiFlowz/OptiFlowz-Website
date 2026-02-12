// app/page.tsx
import Image from "next/image";
import type { Metadata } from "next";
import ProjectsSection from "@/app/components/projectsSection";

export const metadata: Metadata = {
  title:
    "OptiFlowz - Custom video platforms, scalable web applications, and business automation",
  description:
    "Custom video platforms, scalable web applications, and business automation",
};

export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>
          Build Smarter.
          <br />
          Automate Faster.
          <br />
          Scale with <p className="accentText">OptiFlowz</p>
        </h1>
        <Image
          src="/heroImage.webp"
          alt="Logo"
          width={500}
          height={500}
          style={{ width: "400px", height: "400px" }}
          priority
        />
      </section>

      <section className="services">
        <div>
          <Image
            src="/videocam.webp"
            alt="Logo"
            width={100}
            height={100}
            style={{ width: "80px", height: "80px" }}
            priority
          />
          <h2>Custom Video Platforms</h2>
          <p>
            Enterprise-grade streaming solutions tailored to your brand.
            From corporate training to global distribution, we build
            high-performance platforms that scale.
          </p>
        </div>
        <div className="accentService">
          <Image
            src="/webdesign.webp"
            alt="Logo"
            width={100}
            height={100}
            style={{ width: "80px", height: "80px" }}
            priority
          />
          <h2>Web Design &amp; Development</h2>
          <p>
            Modern, responsive websites built with cutting-edge technology.
            From landing pages to complex web applications, we bring your
            vision to life.
          </p>
        </div>
        <div>
          <Image
            src="/automation.webp"
            alt="Logo"
            width={100}
            height={100}
            style={{ width: "80px", height: "80px" }}
            priority
          />
          <h2>Business Automation</h2>
          <p>
            Streamline your workflows and eliminate repetitive tasks. We
            create custom automation solutions that save time and reduce
            costs.
          </p>
        </div>
      </section>

      <ProjectsSection />
    </main>
  );
}