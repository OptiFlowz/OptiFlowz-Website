import type { Metadata } from "next";
import Link from "next/link";
import { ArrowSVG } from "../constants";
import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import LazyContactForm from "../components/lazyContactForm";
import BookACallButton from "./bookACallButton";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pricing of the services OptiFlowz offers",
};

export default function Pricing() {
  return (
    <main className="pp-main pricing-page">
      <FadeInOnScroll threshold={0} distance={24} initialScale={0.985}>
        <section className="pricing-offer">
          <div className="pricing-section-heading">
            <h1>Video Platform pricing</h1>
          </div>

          <div className="pricing-offer-grid">
            <div className="pricing-primary-card">
              <span className="pricing-eyebrow">GET A TAILORED QUOTE</span>
              <h2>Contact us for a monthly quote</h2>
              <p className="pricing-delivery">Delivery within 5 days of purchase</p>
              <p>Pricing is customized based on your unique requirements. Get in touch today for a bespoke quote.</p>
              <div className="pricing-actions">
                <Link className="button noLineHover max-[520px]:w-full! max-[520px]:justify-center" href="/#contactForm">
                  Contact us {ArrowSVG}
                </Link>
                <BookACallButton/>
              </div>
            </div>

            <div className="pricing-included-card">
              <h2>What&apos;s included?</h2>
              <ul className="pricing-included-list">
                <li>Ongoing maintenance and support</li>
                <li>Future updates at no extra cost</li>
                <li>Detailed analytics (daily/weekly/monthly)</li>
                <li>Admin dashboard access</li>
                <li>Content / video management tools</li>
                <li>Priority technical support</li>
              </ul>
            </div>
          </div>

          <div className="pricing-resource-card">
            <div>
              <h2>What features does the platform have?</h2>
              <p>Explore our extensive feature set and find out why industry leaders choose us for their web development and video needs.</p>
            </div>
            <div className="pricing-actions">
              <Link className="button white noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/services/custom-video-platform/release-notes">
                Release notes {ArrowSVG}
              </Link>
              <Link className="button noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/services/custom-video-platform">
                Current features {ArrowSVG}
              </Link>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll threshold={0.05} distance={24} initialScale={0.985}>
        <section className="pricing-offer">
          <div className="pricing-section-heading">
            <h2>Website development pricing</h2>
          </div>

          <div className="pricing-offer-grid">
            <div className="pricing-primary-card">
              <span className="pricing-eyebrow">CONTACT US FOR A CUSTOM QUOTE</span>
              <h2>Custom solutions for your specific needs</h2>
              <p>Because every business has unique goals, our pricing is project-based. Whether you need a high-converting landing page or a complex enterprise application, we provide a detailed quote after an initial discovery call. This ensures you only pay for the features and complexity your business actually requires.</p>
            </div>

            <div className="pricing-included-card">
              <h2>What&apos;s included?</h2>
              <ul className="pricing-included-list">
                <li>Strategic Discovery &amp; Planning</li>
                <li>Custom UI/UX Design</li>
                <li>Performance &amp; SEO Optimization</li>
                <li>Responsive &amp; Mobile-First Build</li>
                <li>Scalable Architecture</li>
              </ul>
            </div>
          </div>

          <div className="pricing-resource-card">
            <div>
              <h2>What do we offer?</h2>
              <p>We&apos;re currently fine-tuning our standard packages. In the meantime, you can take a look at the services we offer!</p>
            </div>
            <div className="pricing-actions">
              <Link className="button white noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/services/web-design-and-development">
                Explore web development {ArrowSVG}
              </Link>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll threshold={0.05} distance={20} initialScale={0.99}>
        <h2 className="mainTitle pricing-contact-title">Contact us for a custom quote</h2>
      </FadeInOnScroll>
      <FadeInOnScroll threshold={0.05} distance={20} initialScale={0.99}>
        <LazyContactForm />
      </FadeInOnScroll>
    </main>
  );
}
