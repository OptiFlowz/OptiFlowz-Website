import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "OptiFlowz - About Us",
  description: "OptiFlowz is a web desgin and automation company - Learn more about us",
};

export default function AboutUs() {
    return(
        <main className="pp-main">
            <FadeInOnScroll>
                <h1 className="mainTitlePP">About Us</h1>
            </FadeInOnScroll>
            <FadeInOnScroll>
                <Image
                    className="aboutUsImage"
                    src="/BelgradeBanner.webp"
                    alt="Business Automation"
                    width={1600}
                    height={900}
                    priority
                />
                <span className="aboutUsImageAccent">
                    <p className="accentText">Belgrade</p>
                </span>
            </FadeInOnScroll>
            <FadeInOnScroll>
                <section>
                    <h2 className="smallTitle">Digital Infrastructure Built to Scale.</h2>
                    <p>From high-performance video architectures to seamless business automation, we transform complex visions into scalable digital realities.</p>
                </section>
            </FadeInOnScroll>
            <FadeInOnScroll>
                <section>
                    <h2 className="smallTitle">Rooted in Belgrade, Scaling Globally</h2>
                    <p>At OptiFlowz, we believe technology should be a multiplier, never a bottleneck. Operating from the heart of Belgrade’s rising tech scene, our team of engineers and strategists helps service-based companies streamline operations and dominate their niche. Whether we’re building a custom streaming engine or a bespoke automation flow, we build for one thing: <span className="accentText">Limitless Scalability</span>.</p>
                </section>
            </FadeInOnScroll>
            <FadeInOnScroll>
                <section className="teamSection">
                    <h2 className="smallTitle">The Team</h2>
                    <p>The architects behind the flow. We are a specialized collective of engineers and designers dedicated to building the systems that keep your business growing.</p>
                </section>
            </FadeInOnScroll>
        </main>
    )
}