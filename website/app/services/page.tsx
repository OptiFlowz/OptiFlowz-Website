import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowSVG } from "../constants";
import FadeInOnScroll from "@/app/components/FadeInOnScroll";
import ScrollArrow from "@/app/components/ScrollArrow";

export const metadata: Metadata = {
  title: "OptiFlowz - Contact",
  description: "Contact Optiflowz to start building your brand",
};

export default function Services() {
  return (
    <main>
      <FadeInOnScroll>
        <h1 className="mainTitle">Services</h1>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="leftService">
          <Image
            src="/services/CustomVideoPlatformBanner.webp"
            alt="Custom Video Platforms Banner"
            width={1280}
            height={720}
            priority
          />
          <div>
            <p>
              Enterprise-grade streaming solutions tailored to your brand.
              From corporate training to global distribution, we build
              high-performance platforms that scale.
            </p>
            <ScrollArrow direction="left" />
            <Link href="/#contactForm" className="button white">
              Need these services?{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="rightService">
          <Image
            src="/services/WebDesignBanner.webp"
            alt="Web Design And Development Banner"
            width={1280}
            height={720}
            priority
          />
          <div>
            <p>
              Modern, responsive websites built with cutting-edge technology.
              From landing pages to complex web applications, we bring your
              vision to life.
            </p>
            <ScrollArrow direction="right" />
            <Link href="/#contactForm" className="button">
              Need these services?{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="leftService">
          <Image
            src="/services/AutomationBanner.webp"
            alt="Automation Banner"
            width={1280}
            height={720}
            priority
          />
          <div>
            <p>
              Streamline your workflows and eliminate repetitive tasks. We
              create custom automation solutions that save time and reduce
              costs.
            </p>
            <ScrollArrow direction="left" />
            <Link href="/#contactForm" className="button white">
              Need these services?{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
    </main>
  );
}