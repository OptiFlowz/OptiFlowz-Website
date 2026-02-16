"use client";

import FadeInOnScroll from "./fadeInOnScroll";
import Image from "next/image";
import ScrollArrow from "./scrollArrow";
import Link from "next/link";
import { ArrowSVG } from "../constants";

export default function ServicesHomeVer2() {
  return (
    <>
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
              Enterprise-grade streaming solutions tailored to your brand. From
              corporate training to global distribution, we build
              high-performance platforms that scale.
            </p>
            <ScrollArrow direction="left" />
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
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="leftService">
          <Image
            src="/services/BuAutomationBanner.webp"
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
          </div>
        </section>
      </FadeInOnScroll>
    </>
  );
}
