import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OptiFlowz - About Us",
  description: "OptiFlowz is a web desgin and automation company - Learn more about us",
};

export default function AboutUs() {
    return(
        <main>
            <FadeInOnScroll>
                <h1 className="mainTitle">About Us</h1>
            </FadeInOnScroll>
            <FadeInOnScroll>
                <section>
                    <h2 className="smallTitle">We Build the Digital Infrastructure for Growth.</h2>
                    <p>From high-performance video platforms to seamless business automation, we transform complex ideas into scalable digital realities.</p>
                </section>
            </FadeInOnScroll>
            <FadeInOnScroll>
                <section>
                    <h2 className="smallTitle">Innovation Driven by Efficiency.</h2>
                    <p>At OptiFlowz, we believe that technology should be a multiplier, not a bottleneck. We are a team of engineers and strategists dedicated to helping service-based companies streamline their operations and dominate their niche. Whether it's a custom streaming engine or a bespoke automation flow, we build with one goal in mind: Scalability.</p>
                </section>
            </FadeInOnScroll>
            <FadeInOnScroll>
                <section className="teamSection">
                    <h2 className="smallTitle">The Team</h2>
                    <p>The engineers and designers behind OptiFlowz. We build the systems that keep your business scaling.</p>
                </section>
            </FadeInOnScroll>
        </main>
    )
}