import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OptiFlowz - Attribution",
  description: "Attribution - Assets OptiFlowz uses in the website or its products",
};

export default function Attribution() {
    return(
        <main>
            <FadeInOnScroll>
                <h1 className="mainTitle">Attribution</h1>
            </FadeInOnScroll>
        </main>
    )
}