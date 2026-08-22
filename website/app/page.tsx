import type { Metadata } from "next";
import ProjectsSection from "@/app/components/projectsSection";
import ServicesHomeVer2 from "./components/servicesHomeVer2";
import HeroSection from "@/app/components/heroSection";
import ScrollScaleSections from "@/app/components/scrollScaleSections";

export const metadata: Metadata = {
  title: {
    absolute: "OptiFlowz - Custom Video Platforms, Web Apps & Automation",
  },
  description:
    "OptiFlowz builds custom video platforms, scalable web applications, and business automation systems for growing organizations.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      <ScrollScaleSections />
      <HeroSection />
      <ServicesHomeVer2 />
      <ProjectsSection />
    </main>
  );
}
