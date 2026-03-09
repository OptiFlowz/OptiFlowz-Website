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

  const videoStoragePricing = 0.5;
  const videoStreamingPricing = 0.1;
  const monthlyPrice = 1200;

  return (
    <main className="pp-main">
      <FadeInOnScroll>
        <h1 className="mainTitle">Video Platform pricing</h1>
      </FadeInOnScroll>
      <FadeInOnScroll delay={100}>
        <div className="pricingWrapper">
          <section>
            <h2 className="smallTitle">Contact us for a monthly quote</h2>
            <p>- Delivery within 5 days of purchase</p>
            <section className="border! border-[#2e84e366]! bg-[#2e70e31a]! grow max-[500px]:p-5! max-[500px]:rounded-xl!">
              <h2>GET A TAILORED QUOTE</h2>
              <p className="max-[500px]:text-sm!">Pricing is customized based on your unique requirements. Get in touch today for a bespoke quote.</p>
              <Link className="button noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/#contactForm">
              Contact us {ArrowSVG}
            </Link>
            </section>
          </section>
          <section>
            <h2 className="smallTitle">What's included?</h2>
            <p>- Ongoing maintenance and support</p>
            <p>- All future updates and enhancements</p>
            <p>- 1600 hours of streaming video (<i>sufficient for 95%+ of clients</i>)</p>
            <p>- Detailed analytics daily/weekly/monthly</p>
            <p>- <strong className="text-(--blueAccent3)">&euro;100</strong> of credit used on video storage and streaming hours (<i>billed based on pricing below</i>)</p>
          </section>
        </div>
      </FadeInOnScroll>
      <FadeInOnScroll delay={200} className="-mt-4!">
        <section>
          <h2 className="smallTitle">What features does the platform have?</h2>
          <p>Explore our extensive feature set and find out why industry leaders choose us for their web development and video needs.</p>
          <div className="flex gap-4 max-[500px]:flex-col max-[500px]:mt-3!">
            <Link className="button white noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/services/custom-video-platform/release-notes">
              Release notes {ArrowSVG}
            </Link>
            <Link className="button noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/services/custom-video-platform">
              Current features {ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll delay={300} className="-mt-4!">
        <section>
          <h2 className="smallTitle">Video Storage and Streaming pricing</h2>
          <section className="smallerBorderSection border! border-[#2e84e366]! bg-[#2e70e31a]! grow max-[500px]:p-5!">
            <p>Video storage: <strong className="text-(--blueAccent3)">&euro;{videoStoragePricing.toFixed(2)}</strong> per hour of video stored per month
            <br/>
            Video streaming: <strong className="text-(--blueAccent3)">&euro;{videoStreamingPricing.toFixed(2)}</strong> per hour streamed</p>
            <p>Note: Includes €100 free monthly credit. You will only be billed for usage exceeding this amount.</p>
          </section>
        </section>
      </FadeInOnScroll>
      {/* <FadeInOnScroll delay={400} className="-mt-4!">
        <section>
          <p>Our latest Video Platform pricing is available in the PDF. Open it to explore packages and add-ons, or contact us for a custom quote.</p>
          <div className="flex gap-4 max-[500px]:flex-col max-[500px]:mt-3!">
            <Link className="button noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/OptiFlowz_Video_Corner_Pricing_Feb2026.pdf" target="_blank">
              Get pricing in PDF{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll> */}
      <FadeInOnScroll delay={400}>
        <h2 className="mainTitle">Website development pricing</h2>
      </FadeInOnScroll>
      <FadeInOnScroll delay={500}>
        <div className="pricingWrapper">
          <section>
            <h2 className="smallTitle">Custom solutions for your specific needs</h2>
            <section className="border! border-[#2e84e366]! bg-[#2e70e31a]! grow max-[500px]:p-5! max-[500px]:rounded-xl!">
              <h2>CONTACT US FOR A CUSTOM QUOTE</h2>
              <p className="max-[500px]:text-sm!">Because every business has unique goals, our pricing is project-based. Whether you need a high-converting landing page or a complex enterprise application, we provide a detailed quote after an initial discovery call. This ensures you only pay for the features and complexity your business actually requires.</p>
            </section>
          </section>
          <section>
            <h2 className="smallTitle">What's included?</h2>
            <p>- Strategic Discovery & Planning</p>
            <p>- Custom UI/UX Design</p>
            <p>- Performance & SEO Optimization</p>
            <p>- Responsive & Mobile-First Build</p>
            <p>- Scalable Architecture</p>
          </section>
        </div>
      </FadeInOnScroll>
      <FadeInOnScroll delay={600} className="-mt-4!">
        <section>
          <h2 className="smallTitle">What do we offer?</h2>
          <p>We're currently fine-tuning our standard packages. In the meantime, you can take a look at the services we offer!</p>
          <div className="flex gap-4 max-[500px]:flex-col max-[500px]:mt-3!">
            <Link className="button white noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/services/web-design-and-development">
              Read more {ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll delay={700}>
        <h2 className="mainTitle">Contact us for a custom quote</h2>
      </FadeInOnScroll>
      <FadeInOnScroll delay={800}>
        <ContactForm />
      </FadeInOnScroll>
    </main>
  );
}