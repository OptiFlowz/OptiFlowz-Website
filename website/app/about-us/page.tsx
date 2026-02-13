import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About OptiFlowz",
  description: "Learn more about OptiFlowz",
};

export default function AboutUs() {
  return (
    <main>
      <h1>About Us</h1>
      <p>This is the about page.</p>
    </main>
  );
}