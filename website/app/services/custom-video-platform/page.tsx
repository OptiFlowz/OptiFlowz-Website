import type { Metadata } from "next";
import Link from "next/link";
import ReusableTimelineSection, { TimelineSectionItem } from "@/app/components/reusableTimeLineSection";
import { ArrowSVG } from "../../constants";
import FadeInOnScroll from "@/app/components/fadeInOnScroll";

export const metadata: Metadata = {
  title: "OptiFlowz - Pricing",
  description: "Pricing of the services OptiFlowz offers",
};

export default function Pricing() {

  const sections: TimelineSectionItem[] = [
    {
      label: "Playlists with Autoplay",
      image: { src: "/video-platform/PlaylistsBanner.webp", alt: "Playlists with Autoplay" },
      title: "Playlists with Autoplay",
      description: [
        "Playlist videos play automatically one after another without interruption.",
        "Users can launch an entire training series and watch without manually starting each video.",
      ],
    },
    {
      label: "Video Chapters",
      image: { src: "/video-platform/VideoChaptersBanner.webp", alt: "Video Chapters" },
      title: "Custom player with Video Chapters",
      description: [
        "Each video can be divided into chapters with navigation. Users jump directly to the relevant section.",
        "Employees don't have to watch an entire 45-minute video — they immediately find the part they need.",
      ],
    },
    {
      label: "Multilingual subtitles",
      image: { src: "/video-platform/MultiLingualSubitlesBanner.webp", alt: "Multilingual subtitles" },
      title: "Multilingual subtitles/captions",
      description: [
        "Support for subtitles/captions in multiple languages. Users choose the subtitle language during playback.",
        "Accessibility for deaf and hard-ofhearing users, plus support for multinational teams.",
      ],
    },
    {
      label: "Chromecast & AirPlay",
      image: { src: "/video-platform/ChromecastAirPlayBanner.webp", alt: "Chromecast & AirPlay" },
      title: "Chromecast & AirPlay integration",
      description: [
        "Ability to cast videos to TV or other devices via Chromecast and AirPlay.",
        "Users can watch training content on a big screen in the office or at home.",
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
          <h2 className="smallTitle">What is Video Corner?</h2>
          <p>Video Corner by OptiFlowz is a private, fully branded video platform that your organization uses as 
            its own streaming service for employee training, internal communication, knowledge management, 
            or video content distribution.
          </p>
          <p>Unlike generic solutions such as YouTube, Vimeo, or Google Drive, Video Corner is a platform that 
            carries YOUR brand, YOUR domain, and YOUR design — while we take care of everything behind 
            the scenes: hosting, maintenance, support, and technical improvements.
          </p>
        </section>
      </FadeInOnScroll>
      <FadeInOnScroll delay={200}>
        <ReusableTimelineSection
          intro={{
            heading: "Current Features",
            subheading:
              "Don't worry, we're always updating Video Corner to be even better!",
          }}
          sections={sections}
          dotIcon={ArrowSVG}
        />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <section>
          <h2 className="smallTitle">Video Corner pricing</h2>
          <p>Our latest Video Corner pricing is available in the PDF. Open it to explore packages and add-ons, or contact us for a custom quote.</p>
          <div className="flex gap-4">
            <Link className="button noLineHover" href="/OptiFlowz_Video_Corner_Pricing_Feb2026.pdf" target="_blank">
              Get pricing{ArrowSVG}
            </Link>
          </div>
        </section>
      </FadeInOnScroll>
    </main>
  );
}