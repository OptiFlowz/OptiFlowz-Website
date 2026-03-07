import type { Metadata } from "next";
import Link from "next/link";
import ReusableTimelineSection, { TimelineSectionItem } from "@/app/components/reusableTimeLineSection";
import { ArrowSVG } from "../../constants";
import FadeInOnScroll from "@/app/components/fadeInOnScroll";

export const metadata: Metadata = {
  title: "OptiFlowz - Web design and development",
  description: "Features and benefits of the Web design and development services offered by OptiFlowz",
};

export default function Pricing() {

  const sections: TimelineSectionItem[] = [
    {
      label: "Convert Searches into Sales",
      image: { src: "/web-design/SEOBanner.webp", alt: "OptiFlowz SEO" },
      title: "Data-Driven SEO",
      description: [
        "Stop guessing and start growing. Our SEO framework combines technical precision with strategic keyword targeting, turning your website into a powerful lead-generation machine that works around the clock.",
      ],
    },
    {
      label: "Seamless on every screen",
      image: { src: "/web-design/WebsitesThatWorkBanner.webp", alt: "Responsive design and development" },
      title: "Fully Responsive Design",
      description: [
        "Your website should look stunning whether it's on a 27-inch monitor or a smartphone.",
        "We build fluid, adaptive interfaces that automatically adjust to any screen size, providing a consistent and professional experience for every visitor.",
      ],
    },
    {
      label: "Built to scale with your ambition",
      image: { src: "/web-design/BuiltToScaleBanner.webp", alt: "Scalable Web Infrastructure" },
      title: "Scalable Web Infrastructure",
      description: [
        "As your business grows, your technology should too. We build powerful web applications designed to handle increasing traffic and complex data, ensuring your platform remains fast and reliable no matter how large your audience becomes.",
      ],
    },
  ];

  return (
    <main className="pp-main">
      <FadeInOnScroll>
        <h1 className="mainTitlePP">Web design & development</h1>
        <p>Modern, responsive websites built with cutting-edge technology.</p>
      </FadeInOnScroll>
      <FadeInOnScroll delay={100} threshold={0.01}>
        <ReusableTimelineSection
          sections={sections}
          dotIcon={ArrowSVG}
        />
      </FadeInOnScroll>
      <FadeInOnScroll delay={300}>
        <section>
          <h2 className="smallTitle">Web design and development pricing</h2>
          <p>Pricing for our web design and development aren't currently available. Contact us to get a custom quote.</p>
          <div className="flex gap-4">
            <Link className="button noLineHover" href="/#contactForm">
              Contact Us{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
    </main>
  );
}