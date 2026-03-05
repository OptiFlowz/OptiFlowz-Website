import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OptiFlowz - Blog",
  description: "OptiFlowz is a web desgin and automation company - Learn more about us",
};

export default function Blog() {
    return(
        <main className="pp-main">
            <FadeInOnScroll>
                <h1 className="mainTitle">Blog</h1>
                <p>Read our latest news and updates</p>
            </FadeInOnScroll>
                <FadeInOnScroll>
                    <section className="blogSection">
                        <p>🥲&nbsp;&nbsp;Blog is currently in development</p>
                    </section>
                </FadeInOnScroll>
        </main>
    )
}