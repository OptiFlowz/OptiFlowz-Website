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
          <h2 className="smallTitle font-light!">We’re currently fine-tuning our standard packages. In the meantime, let’s talk about a solution that fits your exact budget and scope.</h2>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ContactForm />
      </FadeInOnScroll>
    </main>
  );
}