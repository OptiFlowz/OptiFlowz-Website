import FadeInOnScroll from "./fadeInOnScroll";
import Image from "next/image";
import ScrollArrow from "./scrollArrow";
import Link from "next/link";
import { ArrowSVG } from "../constants";

export default function ServicesHomeVer2() {
  return (
    <>
      <FadeInOnScroll>
        <section className="leftService" id="services">
          <Image
            src="/services/CustomVideoPlatformBanner-v2.webp"
            alt="Custom Video Platforms Banner"
            width={1280}
            height={720}
            sizes="(max-width: 650px) calc(100vw - 40px), (max-width: 800px) 350px, (max-width: 950px) 400px, (max-width: 1200px) 500px, 650px"
            priority
          />
          <div>
            <p>
              Enterprise-grade streaming solutions tailored to your brand. From
              corporate training to global distribution, we build
              high-performance platforms that scale.
            </p>
            <ScrollArrow direction="left" />
            <Link className="button white" href="/services/custom-video-platform">
              Explore video platforms {ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="rightService">
          <Image
            src="/services/WebDesignBanner-v2.webp"
            alt="Web Design And Development Banner"
            width={1280}
            height={720}
            sizes="(max-width: 650px) calc(100vw - 40px), (max-width: 800px) 350px, (max-width: 950px) 400px, (max-width: 1200px) 500px, 650px"
          />
          <div>
            <p>
              Modern, responsive websites built with cutting-edge technology.
              From landing pages to complex web applications, we bring your
              vision to life.
            </p>
            <ScrollArrow direction="right" />
            <Link className="button" href="/services/web-design-and-development">
              Explore web development {ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="leftService">
          <Image
            src="/services/BuAutomationBanner-v2.webp"
            alt="Automation Banner"
            width={1280}
            height={720}
            sizes="(max-width: 650px) calc(100vw - 40px), (max-width: 800px) 350px, (max-width: 950px) 400px, (max-width: 1200px) 500px, 650px"
          />
          <div>
            <p>
              Streamline your workflows and eliminate repetitive tasks. We
              create custom automation solutions that save time and reduce
              costs.
            </p>
            <ScrollArrow direction="left" />
            <Link className="button white" href="/services/business-automation">
              Explore business automation {ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
    </>
  );
}
