import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
            <FadeInOnScroll delay={100}>
                <section>
                    <h2 className="smallTitle">Digital Infrastructure Built to Scale.</h2>
                    <p>From high-performance video architectures to seamless business automation, we transform complex visions into scalable digital realities.</p>
                </section>
            </FadeInOnScroll>
            <FadeInOnScroll delay={200}>
                <section>
                    <h2 className="smallTitle">Rooted in Belgrade, Scaling Globally</h2>
                    <p>At OptiFlowz, we believe technology should be a multiplier, never a bottleneck. Operating from the heart of Belgrade’s rising tech scene, our team of engineers and strategists helps service-based companies streamline operations and dominate their niche. Whether we’re building a custom streaming engine or a bespoke automation flow, we build for one thing: <span className="accentText">Limitless Scalability</span>.</p>
                </section>
            </FadeInOnScroll>
            <FadeInOnScroll delay={300}>
                <section className="teamSection">
                    <h2 className="smallTitle">The Team</h2>
                    <p>The architects behind the flow. We are a specialized collective of engineers and designers dedicated to building the systems that keep your business growing.</p>
                </section>
            </FadeInOnScroll>
            <FadeInOnScroll delay={400}>
                <section>
                    <h2 className="smallTitle">Our socials</h2>
                    <p>If you so choose, follow our socials</p>
                    <div className="socials">
                            <Link className="noLineHover" href="https://www.instagram.com/optiflowz/" target="_blank">
                                <Image 
                                    src="/social/instagramSVG.svg"
                                    alt="Instagram Logo"
                                    width={50}
                                    height={50}
                                    style={{width: "30px", height: "30px"}}
                                    priority
                                />
                            </Link>
                            <Link className="noLineHover" href="/" target="_blank">
                                <Image 
                                    src="/social/facebookSVG.svg"
                                    alt="Facebook Logo"
                                    width={50}
                                    height={50}
                                    style={{width: "30px", height: "30px"}}
                                    priority
                                />
                            </Link>
                            <Link className="noLineHover" href="https://www.linkedin.com/company/optiflowz/" target="_blank">
                                <Image 
                                    src="/social/linkedInSVG.svg"
                                    alt="LinkedIn Logo"
                                    width={50}
                                    height={50}
                                    style={{width: "30px", height: "30px"}}
                                    priority
                                />
                            </Link>
                            <Link className="noLineHover" href="https://x.com/OptiFlowz" target="_blank">
                                <Image 
                                    src="/social/XSVG.svg"
                                    alt="X Logo"
                                    width={50}
                                    height={50}
                                    style={{width: "30px", height: "30px"}}
                                    priority
                                />
                            </Link>
                            <Link className="noLineHover" href="https://www.youtube.com/@OptiFlowz" target="_blank">
                                <Image 
                                    src="/social/YouTubeSVG.svg"
                                    alt="YouTube Logo"
                                    width={50}
                                    height={50}
                                    style={{width: "30px", height: "30px"}}
                                    priority
                                />
                            </Link>
                        </div>
                </section>
            </FadeInOnScroll>
        </main>
    )
}