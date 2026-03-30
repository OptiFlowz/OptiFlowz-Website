import type { Metadata } from "next";
import Link from "next/link";
import ReusableTimelineSection, { TimelineSectionItem } from "@/app/components/reusableTimeLineSection";
import { ArrowSVG } from "../../constants";
import FadeInOnScroll from "@/app/components/fadeInOnScroll";

export const metadata: Metadata = {
  title: "OptiFlowz - Custom Video Platform",
  description: "Features and benefits of the Custom Video Platform service offered by OptiFlowz",
};

export default function Pricing() {

  const sections: TimelineSectionItem[] = [
    {
      label: "Just hit upload. We'll take it from there",
      image: { src: "/video-platform/AutomatedBanner.webp", alt: "Playlists with Autoplay" },
      title: "Automated video processing and taxonomy",
      description: [
        "Upload your file and let our AI handle the busy work. It automatically builds out your chapters, captions, and SEO tags, turning a simple video file into a fully organized, accessible training module without you lifting a finger.",
        "(Don't worry, you can always edit the AI's work if you want to make adjustments.)",
      ],
    },
    {
      label: "Real-Time Performance Tracking",
      image: { src: "/video-platform/DetailedAnalytics.webp", alt: "Detailed Analytics" },
      title: "Detailed Analytics",
      description: [
        "Look beyond the surface level. We provide granular data that reveals exactly how users interact with your content.",
        "From heatmaps to session durations, our analytics suite helps you fine-tune your strategy for maximum retention and impact.",
      ],
    },
    {
      label: "Get straight to the point",
      image: { src: "/video-platform/VideoChaptersBanner.webp", alt: "Video Chapters" },
      title: "Automatically generated video chapters",
      description: [
        "Each video can be divided into chapters with navigation. Users jump directly to the relevant section.",
        "Employees don't have to watch an entire 45-minute video — they immediately find the part they need.",
      ],
    },
    {
      label: "Watch start to finish",
      image: { src: "/video-platform/PlaylistsBanner.webp", alt: "Playlists with Autoplay" },
      title: "Playlists with Autoplay",
      description: [
        "Playlist videos play automatically one after another without interruption.",
        "Users can launch an entire training series and watch without manually starting each video.",
      ],
    },
    {
      label: "Universal accessibility",
      image: { src: "/video-platform/MultiLingualSubitlesBanner.webp", alt: "Multilingual subtitles" },
      title: "Multilingual subtitles/captions",
      description: [
        "Choose the languages you want, and our AI automatically generates subtitles/captions in those languages. Users choose the subtitle language during playback.",
        "Accessibility for deaf and hard-ofhearing users, plus support for multinational teams.",
      ],
    },
    {
      label: "Watch wherever you want",
      image: { src: "/video-platform/ChromecastAirplayBanner.webp", alt: "Chromecast & AirPlay" },
      title: "Chromecast & AirPlay integration",
      description: [
        "Ability to cast videos to TV or other devices via Chromecast and AirPlay.",
        "Users can watch training content on a big screen in the office or at home.",
      ],
    },
    {
      label: "Collaborative learning in one place",
      image: { src: "/video-platform/CommentsBanner.webp", alt: "Interactive videos with comments" },
      title: "Interactive videos with comments",
      description: [
        "Enable users to leave comments directly below videos and engage in meaningful discussions around the content.",
        "Whether it's asking questions, sharing feedback, or exchanging insights, comments turn passive watching into active collaboration and improve learning outcomes.",
      ],
    },
  ];

  return (
    <main className="pp-main">
      <FadeInOnScroll>
        <h1 className="mainTitlePP">Custom Video Platform</h1>
        <p>Your Private, Branded Video Platform — Fully Managed</p>
      </FadeInOnScroll>
      <FadeInOnScroll delay={100}>
        <section>
          <h2 className="smallTitle">What is OptiFlowz Video Platform?</h2>
          <p>Video Platform by OptiFlowz is a private, fully branded streaming service built for your organization — for training, internal communication, or content distribution.</p>
          <p>No YouTube. No Vimeo. No Google Drive. Your brand, your domain, your design. We handle hosting, maintenance, support, and updates.</p>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll delay={200} threshold={0.01}>
        <ReusableTimelineSection
          intro={{
            heading: "Current Features",
            subheading:
              "Don't worry, we're always updating Video Platform to be even better!",
          }}
          sections={sections}
          dotIcon={ArrowSVG}
        />
      </FadeInOnScroll>
      <FadeInOnScroll delay={300}>
        <section>
          <h2 className="smallTitle">Video Platform release notes</h2>
          <p>Take a look at the latest updates and improvements to our Video Platform.</p>
           <div className="flex gap-4 max-[500px]:flex-col max-[500px]:mt-3!">
            <Link className="button white noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/services/custom-video-platform/release-notes">
              View release notes{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll delay={400}>
        <section>
          <h2 className="smallTitle">Video Platform pricing</h2>
          <p>Our latest Video Platform pricing is available on the next page. There's also a detailed PDF of current and future features, along with their pricing.</p>
           <div className="flex gap-4 max-[500px]:flex-col max-[500px]:mt-3!">
            <Link className="button noLineHover max-[500px]:w-full! max-[500px]:justify-center" href="/pricing">
              See pricing{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
    </main>
  );
}