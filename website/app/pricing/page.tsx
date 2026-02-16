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
      <FadeInOnScroll>
        <section>
          <h2 className="smallTitle">Video Corner pricing</h2>
          <p>Our latest Video Corner pricing is available in the PDF. Open it to explore packages and add-ons, or contact us for a custom quote.</p>
          <Link className="button noLineHover" href="/OptiFlowz_Video_Corner_Pricing_Feb2026.pdf" target="_blank">Get pricing{ArrowSVG}</Link>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll>
        <section>
          <h2 className="smallTitle">Website development and Business automation pricing</h2>
          <p>We're currently fine-tuning our standard packages. In the meantime, let's talk about a solution that fits your exact budget and scope.</p>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ContactForm />
      </FadeInOnScroll>
    </main>
  );
}