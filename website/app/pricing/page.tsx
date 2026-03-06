import type { Metadata } from "next";
import Link from "next/link";
import { ArrowSVG } from "../constants";
import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import ContactForm from "../components/contactForm";

export const metadata: Metadata = {
  title: "OptiFlowz - Pricing",
  description: "Pricing of the services OptiFlowz offers",
};

export default function Pricing() {
  return (
    <main className="pp-main">
      <FadeInOnScroll>
        <h1 className="mainTitle">Pricing</h1>
      </FadeInOnScroll>
      <FadeInOnScroll delay={100}>
        <section>
          <h2 className="smallTitle">Video Corner pricing</h2>
          <p>Our latest Video Corner pricing is available in the PDF. Open it to explore packages and add-ons, or contact us for a custom quote.</p>
          <div className="flex gap-4 max-[435px]:flex-col max-[435px]:mt-3!">
            <Link className="button white noLineHover max-[435px]:w-full! max-[435px]:justify-center" href="/services/custom-video-platform">
              Read more {ArrowSVG}
            </Link>
            <Link className="button noLineHover max-[435px]:w-full! max-[435px]:justify-center" href="/OptiFlowz_Video_Corner_Pricing_Feb2026.pdf" target="_blank">
              Get pricing{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll delay={200}>
        <section>
          <h2 className="smallTitle">Website development and Business automation pricing</h2>
          <p>We're currently fine-tuning our standard packages. In the meantime, let's talk about a solution that fits your exact budget and scope.</p>
          <div className="flex gap-4 max-[435px]:flex-col max-[435px]:mt-3!">
            <Link className="button white noLineHover max-[435px]:w-full! max-[435px]:justify-center" href="/services/web-design-and-development">
              Read more {ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll delay={300}>
        <ContactForm />
      </FadeInOnScroll>
    </main>
  );
}