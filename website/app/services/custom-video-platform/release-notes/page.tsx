import type { Metadata } from "next";
import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import ReleaseNotesTimeline from "./releaseNotesTimeline";

export const metadata: Metadata = {
  title: "Video Platform Release Notes",
  description: "Release notes for the Video Platform service offered by OptiFlowz",
};

export default function ReleaseNotes() {
  return (
    <main className="pp-main release-notes-page">
      <FadeInOnScroll>
        <div className="release-notes-intro">
          <h1 className="mainTitlePP">OptiFlowz Video Platform release notes</h1>
          <p>
            Follow every new feature, interface improvement, fix, and platform update
            in one clear timeline.
          </p>
        </div>
      </FadeInOnScroll>

      <ReleaseNotesTimeline />
    </main>
  );
}
