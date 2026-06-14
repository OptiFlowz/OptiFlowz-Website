import type { Metadata } from "next";
import FadeInOnScroll from "@/app/components/fadeInOnScroll";

export const metadata: Metadata = {
  title: "OptiFlowz - Video Platform release notes",
  description: "Release notes for the Video Platform service offered by OptiFlowz",
};

export default function ReleaseNotes() {

  return (
    <main className="pp-main">
        <FadeInOnScroll>
            <h1 className="mainTitlePP">OptiFlowz Video Platform release notes</h1>
            <p>Stay up-to-date with the latest features and improvements to our Video Platform.</p>
        </FadeInOnScroll>
        <FadeInOnScroll delay={100}>
            <section>
                <h2 className="smallTitle"><span className="latest orange">Coming soon</span>Version 1.1.7</h2>
                <p>- Quizzes and courses</p>
                <p>- Quiz certificates</p>
                <p>- Live streaming</p>
                <p>- Further UI improvements and polish</p>
                <p>- Move the platform to NextJS (For better SEO)</p>
            </section>
        </FadeInOnScroll>
        <FadeInOnScroll delay={200}>
            <section>
                <h2 className="smallTitle"><span className="latest blue">latest</span>Version 1.1.6</h2>
                <p>- AI assistant to guide users through the app</p>
                <p>- Further UI improvements and polish</p>
                <p>- Move the platform to NextJS (For better SEO)</p>
            </section>
        </FadeInOnScroll>
        <FadeInOnScroll delay={300}>
            <section>
                <h2 className="smallTitle">Version 1.1.5</h2>
                <p>- BIG UI/UX Redesign</p>
                <p>- Comments on videos</p>
                <p>- Google account login</p>
                <p>- DRM integration</p>
                <p>- A screen for when the server is unavailable</p>
                <p>- Page load speed and performance improvements</p>
            </section>
        </FadeInOnScroll>
        <FadeInOnScroll delay={400}>
            <section>
                <h2 className="smallTitle">Version 1.1.4</h2>
                <p>- Uploading a video now automaticaly generates video details (title, description, subtitles, chapters, etc.)</p>
                <p>- Admin My Videos page where you can manage your uploaded videos</p>
                <p>- An edit video page for admins</p>
                <p>- Added a YouTube-like loader at the top of the page</p>
                <p>- Profile page redesign</p>
                <p>- Better 404 page</p>
                <p>- Media API integration</p>
            </section>
        </FadeInOnScroll>
        <FadeInOnScroll delay={500}>
            <section>
                <h2 className="smallTitle">Version 1.1.3</h2>
                <p>- Added theater mode to the player</p>
                <p>- Added featured playlists to the homepage</p>
                <p>- Basic admin page for uploading videos without AI generation</p>
                <p>- Page load speed and performance improvements</p>
            </section>
        </FadeInOnScroll>
        <FadeInOnScroll delay={600}>
            <section>
                <h2 className="smallTitle">Version 1.1.2</h2>
                <p>- Full custom player with chapter support</p>
                <p>- Added video chapter capability</p>
                <p>- Chapters can be opened next to the video like playlist view</p>
                <p>- Automatic video subtitle generation now works in most languages</p>
            </section>
        </FadeInOnScroll>
        <FadeInOnScroll delay={700}>
            <section>
                <h2 className="smallTitle">Version 1.1.1</h2>
                <p>- Page load speed and performance improvements</p>
                <p>- Users can now reset their password</p>
                <p>- Playlists, playlist page, saving playlists and sharing playlists</p>
                <p>- Playlist autoplay, playlist now stays along side the video and can be watched in one go</p>
                <p>- You can now search playlists and people alongside videos</p>
            </section>
        </FadeInOnScroll>
        <FadeInOnScroll delay={800}>
            <section>
                <h2 className="smallTitle">Version 1.1.0</h2>
                <p>- Further design and usability improvements</p>
                <p>- BIG Page load speed and performance improvements</p>
                <p>- Account can now be edited (<i>name, biography, profile picture</i>)</p>
                <p>- Playlists, playlist page, saving playlists and sharing playlists</p>
                <p>- Playlist autoplay, playlist now stays along side the video and can be watched in one go</p>
                <p>- You can now search playlists and people alongside videos</p>
                <p>- Automatic video subtitle generation in English</p>
                <p>- Improved accessibility features</p>
                <p>- Added a slider on the home page</p>
            </section>
        </FadeInOnScroll>
        <FadeInOnScroll delay={900}>
            <section>
                <h2 className="smallTitle">Version 1.0.2</h2>
                <p>- Further design and usability improvements</p>
                <p>- Page load speed and performance improvements</p>
                <p>- Like/Dislike system</p>
                <p>- Added continue watching section on the homepage</p>
                <p>- Account page with liked videos, watch history and continue watching</p>
            </section>
        </FadeInOnScroll>
        <FadeInOnScroll delay={1000}>
            <section>
                <h2 className="smallTitle">Version 1.0.1</h2>
                <p>- Further design and usability improvements</p>
                <p>- Full video page, with title, description, speakers, tags, etc.</p>
                <p>- Similar video algorithm on the side of the current video</p>
                <p>- Video share functionality</p>
                <p>- Basic search algorithm, and search page. Only videos can be searched</p>
            </section>
        </FadeInOnScroll>
        <FadeInOnScroll delay={1100}>
            <section>
                <h2 className="smallTitle">Version 1.0.0 - Initial release</h2>
                <p>- Homepage with a recommended section and trending videos</p>
                <p>- Default Mux Video player with playback controls</p>
                <p>- User authentication and access control</p>
                <p>- Basic recommendation and trending algorithm</p>
                <p>- Register/Login pages</p>
            </section>
        </FadeInOnScroll>
    </main>
  );
}