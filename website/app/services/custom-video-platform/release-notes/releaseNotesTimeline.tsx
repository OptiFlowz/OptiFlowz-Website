"use client";

import ReusableTimelineSection, {
  TimelineSectionItem,
} from "@/app/components/reusableTimeLineSection";
import { ArrowSVG } from "@/app/constants";

type ChangeCategory =
  | "New Feature"
  | "UI/UX"
  | "Improvement"
  | "Fix"
  | "Infrastructure"
  | "Security";

type Release = {
  version: string;
  status?: "Coming soon" | "Latest";
  changes: Array<{ category: ChangeCategory; text: string }>;
};

const releases: Release[] = [
  {
    version: "Version 1.2.0",
    status: "Coming soon",
    changes: [
      { category: "New Feature", text: "Live streaming with live chat" },
      { category: "Improvement", text: "Better and more comprehensive role system" },
      { category: "Improvement", text: "Detailed platform settings for owners and administrators" },
      { category: "Improvement", text: "Platform localization in 16 languages: Arabic, German, English, Spanish, French, Greek, Hindi, Croatian, Italian, Dutch, Polish, Portuguese, Romanian, Slovenian, Serbian, and Turkish, with more coming soon" },
      { category: "UI/UX", text: "Further UI improvements and polish" },
      { category: "Security", text: "Full GDPR, CCPA, and PIPEDA compliance" },
    ],
  },
  {
    version: "Version 1.1.8",
    status: "Latest",
    changes: [
      { category: "New Feature", text: "Interactive video transcripts with clickable timestamps for quick navigation" },
      { category: "New Feature", text: "Floating mini player that keeps videos playing as you browse other pages" },
      { category: "UI/UX", text: "Customizable subtitle color, size, and background in the video player" },
      { category: "Security", text: "Began implementing GDPR compliance measures across the platform" },
      { category: "UI/UX", text: "Further UI improvements and polish" },
    ],
  },
  {
    version: "Version 1.1.7",
    changes: [
      { category: "New Feature", text: "Quizzes and courses" },
      { category: "New Feature", text: "Quiz certificates" },
      { category: "New Feature", text: "Live analytics for every video, channel, and the entire platform" },
      { category: "UI/UX", text: "Further UI improvements and polish" },
      { category: "Infrastructure", text: "Moved the platform fully to Next.js for better SEO" },
    ],
  },
  {
    version: "Version 1.1.6",
    changes: [
      { category: "New Feature", text: "AI assistant that guides users through the app" },
      { category: "UI/UX", text: "Further UI improvements and polish" },
      { category: "Infrastructure", text: "Began moving the platform to Next.js for better SEO" },
    ],
  },
  {
    version: "Version 1.1.5",
    changes: [
      { category: "UI/UX", text: "Major UI/UX redesign" },
      { category: "New Feature", text: "Comments on videos" },
      { category: "Security", text: "Google account login" },
      { category: "Security", text: "DRM integration" },
      { category: "Fix", text: "Dedicated screen for times when the server is unavailable" },
      { category: "Improvement", text: "Page-load speed and performance improvements" },
    ],
  },
  {
    version: "Version 1.1.4",
    changes: [
      { category: "New Feature", text: "Video uploads now automatically generate titles, descriptions, subtitles, chapters, and other details" },
      { category: "New Feature", text: "Admin My Videos page for managing uploaded videos" },
      { category: "New Feature", text: "Video editing page for administrators" },
      { category: "UI/UX", text: "YouTube-style loader at the top of the page" },
      { category: "UI/UX", text: "Profile page redesign" },
      { category: "Fix", text: "Improved 404 page" },
      { category: "Infrastructure", text: "Media API integration" },
    ],
  },
  {
    version: "Version 1.1.3",
    changes: [
      { category: "New Feature", text: "Theater mode in the video player" },
      { category: "New Feature", text: "Featured playlists on the homepage" },
      { category: "New Feature", text: "Basic admin page for uploading videos without AI generation" },
      { category: "Improvement", text: "Page-load speed and performance improvements" },
    ],
  },
  {
    version: "Version 1.1.2",
    changes: [
      { category: "New Feature", text: "Fully custom video player with chapter support" },
      { category: "New Feature", text: "Video chapter capability" },
      { category: "UI/UX", text: "Chapters can open beside the video in a playlist-style view" },
      { category: "New Feature", text: "Automatic subtitle generation in most languages" },
    ],
  },
  {
    version: "Version 1.1.1",
    changes: [
      { category: "Improvement", text: "Page-load speed and performance improvements" },
      { category: "Security", text: "Password reset for users" },
      { category: "New Feature", text: "Playlists with dedicated pages, saving, and sharing" },
      { category: "New Feature", text: "Playlist autoplay with the playlist displayed beside the video" },
      { category: "Improvement", text: "Search now includes playlists and people alongside videos" },
    ],
  },
  {
    version: "Version 1.1.0",
    changes: [
      { category: "UI/UX", text: "Further design and usability improvements" },
      { category: "Improvement", text: "Major page-load speed and performance improvements" },
      { category: "New Feature", text: "Editable account name, biography, and profile picture" },
      { category: "New Feature", text: "Playlists with dedicated pages, saving, and sharing" },
      { category: "New Feature", text: "Playlist autoplay with the playlist displayed beside the video" },
      { category: "Improvement", text: "Search for playlists and people alongside videos" },
      { category: "New Feature", text: "Automatic English subtitle generation" },
      { category: "Improvement", text: "Improved accessibility features" },
      { category: "UI/UX", text: "Homepage content slider" },
    ],
  },
  {
    version: "Version 1.0.2",
    changes: [
      { category: "UI/UX", text: "Further design and usability improvements" },
      { category: "Improvement", text: "Page-load speed and performance improvements" },
      { category: "New Feature", text: "Like and dislike system" },
      { category: "New Feature", text: "Continue Watching section on the homepage" },
      { category: "New Feature", text: "Account page with liked videos, watch history, and Continue Watching" },
    ],
  },
  {
    version: "Version 1.0.1",
    changes: [
      { category: "UI/UX", text: "Further design and usability improvements" },
      { category: "New Feature", text: "Full video page with title, description, speakers, tags, and more" },
      { category: "New Feature", text: "Similar-video algorithm beside the current video" },
      { category: "New Feature", text: "Video sharing" },
      { category: "New Feature", text: "Basic video search algorithm and search page" },
    ],
  },
  {
    version: "Version 1.0.0",
    changes: [
      { category: "New Feature", text: "Initial homepage with recommended and trending video sections" },
      { category: "New Feature", text: "Mux video player with playback controls" },
      { category: "Security", text: "User authentication and access control" },
      { category: "New Feature", text: "Basic recommendation and trending algorithm" },
      { category: "Security", text: "Registration and login pages" },
    ],
  },
];

const categoryClass = (category: ChangeCategory) =>
  category.toLowerCase().replace("/", "-").replace(" ", "-");

export default function ReleaseNotesTimeline() {
  const sections: TimelineSectionItem[] = releases.map((release) => ({
    label: (
      <span className="release-version-label">
        {release.version}
        {release.status ? (
          <span
            className={`release-status release-status-${release.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {release.status}
          </span>
        ) : null}
      </span>
    ),
    render: (
      <article className="release-card" aria-label={`${release.version} changes`}>
        <ul className="release-change-list">
          {release.changes.map((change, index) => (
            <li key={`${change.category}-${index}`}>
              <span className={`release-category release-category-${categoryClass(change.category)}`}>
                {change.category}
              </span>
              <span className="release-change-text">{change.text}</span>
            </li>
          ))}
        </ul>
      </article>
    ),
  }));

  return (
    <ReusableTimelineSection
      className="release-notes-timeline"
      sections={sections}
      dotIcon={ArrowSVG}
    />
  );
}
