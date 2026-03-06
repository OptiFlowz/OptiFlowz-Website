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
        <h1 className="mainTitle">Pricing</h1>
      </FadeInOnScroll>
      <FadeInOnScroll delay={100}>
        <section>
          <h2 className="smallTitle">Video Corner pricing</h2>
          <p className="-mt-1.5!">Standard monthly fee: <strong className="text-(--blueAccent3)">&euro;{monthlyPrice.toFixed(2)}</strong></p>
          <hr></hr>
          <h2 className="smallTitle">When does billing start?</h2>
          <p className="-mt-1.5!">From the day the platform is live and delivered to the client</p>
          <hr></hr>
          <h2 className="smallTitle">What's included?</h2>
          <p className="-mt-1.5!">Complete hosting, branding, maintenance, support, streaming, all features, all future development. Plus <strong className="text-(--blueAccent3)">&euro;100</strong> of credit used on video storage and streaming hours at these prices: Video storage: <strong className="text-(--blueAccent3)">&euro;{videoStoragePricing.toFixed(2)}</strong> per hour of video stored per month & Video streaming: <strong className="text-(--blueAccent3)">&euro;{videoStreamingPricing.toFixed(2)}</strong> per hour streamed.</p>
          <hr></hr>
          <h2 className="smallTitle">Included streaming:</h2>
          <p className="-mt-1.5!">1,600 hours/month (sufficient for 95%+ of clients)</p>
          <hr></hr>
          <h2 className="smallTitle">What happends after the 1600 hours?</h2>
          <p className="-mt-1.5!">Usage after the limit is exceeded will be billed at an additional rate. Streaming hours above 1,600 are
          billable at <strong className="text-(--blueAccent3)">&euro;{videoStreamingPricing.toFixed(2)}</strong> per hour.
          </p>
          <section className="my-5! border! border-[#2e84e366]! bg-[#2e70e31a]! max-[500px]:p-5! max-[500px]:rounded-xl!">
            <h2>LIMITED SPOTS AT THIS PRICE</h2>
            <p className="max-[500px]:text-sm!">The current price of <strong className="text-(--blueAccent3)">&euro;{monthlyPrice.toFixed(2)}/month</strong> is available to a limited number of clients. As the platform grows 
            and gains new features (AI Chat, Auto-Dubbing), the price for new clients will increase. Existing 
            clients retain their contracted price.</p>
          </section>
          <p>Our latest Video Corner pricing is available in the PDF. Open it to explore packages and add-ons, or contact us for a custom quote.</p>
          <div className="flex gap-4 max-[500px]:flex-col max-[500px]:mt-3!">
            <Link className="button white noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/services/custom-video-platform">
              Read more {ArrowSVG}
            </Link>
            <Link className="button noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/OptiFlowz_Video_Corner_Pricing_Feb2026.pdf" target="_blank">
              Get pricing in PDF{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll delay={200}>
        <section>
          <h2 className="smallTitle">Website development and Business automation pricing</h2>
          <p>We're currently fine-tuning our standard packages. In the meantime, let's talk about a solution that fits your exact budget and scope. Fill out the form below!</p>
          <div className="flex gap-4 max-[500px]:flex-col max-[500px]:mt-3!">
            <Link className="button white noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/services/web-design-and-development">
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