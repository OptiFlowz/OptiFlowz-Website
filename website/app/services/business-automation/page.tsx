import type { Metadata } from "next";
import Link from "next/link";
import ReusableTimelineSection, { TimelineSectionItem } from "@/app/components/reusableTimeLineSection";
import { ArrowSVG } from "../../constants";
import FadeInOnScroll from "@/app/components/fadeInOnScroll";

export const metadata: Metadata = {
  title: "Business Automation",
  description: "Features and benefits of the Business Automation services offered by OptiFlowz",
};

export default function BusinessAutomation() {

  const sections: TimelineSectionItem[] = [
    {
      label: "Your Business on Autopilot",
      image: { src: "/business-automation/BusinessAutopilotBanner.webp", alt: "OptiFlowz Business Automation" },
      title: "Intelligent Workflow Automation",
      description: [
        "Stop wasting time on repetitive tasks. Our automation engine handles the heavy lifting—from lead management to content distribution—allowing you to focus on high-level strategy while your digital ecosystem runs flawlessly in the background.",
      ],
    },
    {
      label: "AI Powered Chatbots",
      image: { src: "/business-automation/AIPoweredChatbotsBanner.webp", alt: "OptiFlowz AI Powered Chatbots" },
      title: "Bespoke AI Assistants",
      description: [
        "Give your brand a digital voice that learns. We build custom-trained AI models that understand your specific business logic, services, and tone.",
        "Whether it's integrated into your video platform or web app, our chatbots provide a seamless, high-tech experience that feels personal and professional.",
      ],
    },
    {
      label: "Streamlined Business Logic",
      image: { src: "/business-automation/AutomateEveryWorkflowBanner.webp", alt: "OptiFlowz Automate Every Workflow" },
      title: "Automate Every Workflow",
      description: [
        "Transform your daily operations into a seamless, self-sustaining ecosystem.",
        "We build custom automation bridges between your apps and data, ensuring that every lead is tracked, every update is synced, and every workflow is optimized for maximum output with zero manual effort.",
      ],
    },
  ];

  return (
    <main className="pp-main">
      <FadeInOnScroll>
        <h1 className="mainTitlePP">Business Automation</h1>
        <p>Streamline your workflows and eliminate repetitive tasks with our custom automation solutions.</p>
      </FadeInOnScroll>
      <FadeInOnScroll delay={100} threshold={0.01}>
        <ReusableTimelineSection
          sections={sections}
          dotIcon={ArrowSVG}
        />
      </FadeInOnScroll>
      <FadeInOnScroll delay={300}>
        <section>
          <h2 className="smallTitle">Business Automation Pricing</h2>
          <p>Pricing for our business automation services isn&apos;t currently available. Contact us to get a custom quote.</p>
          <div className="flex gap-4">
            <Link className="button noLineHover" href="/#contactForm">
              Contact Us{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
    </main>
  );
}
