import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Background from "./components/background";
import Script from "next/dist/client/script";
import ChatAccessibilityLabel from "./components/chatAccessibilityLabel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://optiflowz.com"),
  title: {
    default: "OptiFlowz | Custom Digital Platforms & Automation",
    template: "%s | OptiFlowz",
  },
  description:
    "Custom video platforms, scalable web applications, and business automation systems built for growing organizations.",
  applicationName: "OptiFlowz",
  creator: "OptiFlowz",
  openGraph: {
    type: "website",
    siteName: "OptiFlowz",
    title: "OptiFlowz | Custom Digital Platforms & Automation",
    description:
      "Custom video platforms, scalable web applications, and business automation systems built for growing organizations.",
    url: "https://optiflowz.com",
  },
  twitter: {
    card: "summary",
    title: "OptiFlowz | Custom Digital Platforms & Automation",
    description:
      "Custom video platforms, scalable web applications, and business automation systems built for growing organizations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <Background />
        <Script
          src="https://ai-chatbot-platform.fly.dev/widget/index.js"
          strategy="afterInteractive"
          data-agent-name="OptiFlowz AI"
          data-chat-header-title-font-size="1.3rem"
          data-agent-description="Your friendly AI Agent"
          data-chat-header-description-font-size="0.72rem"
          data-agent-icon="https://cdn.jsdelivr.net/gh/OptiFlowz/OptiFlowz-Main-Chat/aiAgentImg.png"
          data-privacy-url="https://optiflowz.com/privacy-policy"
          data-questions={`["I'd like to work with OptiFlowz","Tell me more about OptiFlowz"]`}
          data-chat-desktop-width="410px"
          data-chat-desktop-height="550px"
        />
        <ChatAccessibilityLabel />
        {children}
        <Footer />
        <Analytics/>
        <SpeedInsights />
      </body>
    </html>
  );
}
