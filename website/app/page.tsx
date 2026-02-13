import type { Metadata } from "next";
import ProjectsSection from "@/app/components/projectsSection";
import ServicesHome from "@/app/components/ServicesHome";
import HeroSection from "@/app/components/HeroSection";

export const metadata: Metadata = {
  title:
    "OptiFlowz - Custom video platforms, scalable web applications, and business automation",
  description:
    "Custom video platforms, scalable web applications, and business automation",
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesHome />
      <ProjectsSection />
    </main>
  );
}