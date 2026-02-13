import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OptiFlowz - Privacy Policy",
  description: "Privacy policy OptiFlowz",
};

export default function PrivacyPolicy() {
    return(
        <main>
            <FadeInOnScroll>
                <h1 className="mainTitle">Privacy Policy</h1>
            </FadeInOnScroll>
        </main>
    )
}