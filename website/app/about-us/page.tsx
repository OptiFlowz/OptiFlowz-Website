import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import { ArrowSVG } from "@/app/constants";
import BlogArticleCard from "@/app/blog/blogArticleCard";
import { getCatogorisedArticles } from "@/lib/articles";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AboutHero from "./aboutHero";
import AboutMission from "./aboutMission";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the OptiFlowz co-founders and learn how we build scalable video platforms, digital products, and business automation systems.",
};

const pillars = [
  {
    eyebrow: "Our products",
    title: "What we build",
    description:
      "Custom video platforms, modern web products, and automation systems shaped around the way each business actually works.",
    link: "/#projects",
    linkLabel: "Explore our work",
    image: "/about/pillars/what-we-build.webp",
  },
  {
    eyebrow: "Our values",
    title: "What guides us",
    description:
      "Clarity over complexity. Ownership over handoffs. Thoughtful execution over shortcuts. We make decisions that keep products useful long after launch.",
    link: "#about-mission",
    linkLabel: "Read our mission",
    image: "/about/pillars/what-guides-us.webp",
  },
  {
    eyebrow: "Reliability",
    title: "How we show up",
    description:
      "The people you meet stay close to the work. From architecture to the final interface, senior ownership remains part of every release.",
    link: "/#contactForm",
    linkLabel: "Start a conversation",
    image: "/about/pillars/how-we-show-up.webp",
  },
];

type TeamSocial = "linkedin" | "github" | "website";
type TeamSocialLink = {
  type: TeamSocial;
  href: string;
};

const team: Array<{
  name: string;
  role: string;
  image: string;
  imageClass: string;
  socials: TeamSocialLink[];
}> = [
  {
    name: "Pavle",
    role: "Co-Founder & CEO",
    image: "/about/team/pavle-v2.webp",
    imageClass: "is-pavle",
    socials: [
      {
        type: "linkedin",
        href: "https://www.linkedin.com/in/pavle-%C4%87erani%C4%87-509199200/",
      },
    ],
  },
  {
    name: "Stefan",
    role: "Co-Founder · Design & Frontend",
    image: "/about/team/stefan.webp",
    imageClass: "is-stefan",
    socials: [
      {
        type: "linkedin",
        href: "https://www.linkedin.com/in/stefanmihajlovic-in/",
      },
      { type: "github", href: "https://github.com/Stefan-Mihajlovic" },
      { type: "website", href: "https://stefanmihajlovic.com/" },
    ],
  },
  {
    name: "Mihailo",
    role: "Co-Founder · Frontend",
    image: "/about/team/mihailo.webp",
    imageClass: "is-mihailo",
    socials: [
      { type: "linkedin", href: "https://www.linkedin.com/in/imikers/" },
      { type: "github", href: "https://github.com/IMikeRS" },
    ],
  },
  {
    name: "Aleksandar",
    role: "Co-Founder · Backend & Architecture",
    image: "/about/team/aleksandar.webp",
    imageClass: "is-aleksandar",
    socials: [
      {
        type: "linkedin",
        href: "https://www.linkedin.com/in/aleksandar-radoji%C4%8Di%C4%87-958b88271/",
      },
      {
        type: "github",
        href: "https://github.com/Aleksandar-Radojicic",
      },
    ],
  },
];

const socialLabels: Record<TeamSocial, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  website: "Website",
};

function TeamSocialIcon({ type }: { type: TeamSocial }) {
  if (type === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 8.4V18M6.5 5.5v.1M10.5 18v-5.4c0-2.2 1.4-3.5 3.3-3.5 2 0 3.7 1.2 3.7 4.2V18M10.5 13.1c0-2.1 1.4-4 3.8-4" />
      </svg>
    );
  }

  if (type === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 21v-3.4c0-1 .1-1.5-.5-2.1 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.6-.1-3.3 0 0-1.1-.3-3.6 1.3a12.2 12.2 0 0 0-6.5 0C6.2 2.2 5.1 2.6 5.1 2.6c-.7 1.7-.2 3-.1 3.3a4.9 4.9 0 0 0-1.3 3.4c0 4.8 2.9 5.9 5.7 6.2-.5.5-.6 1-.6 2.1V21" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.8 12h16.4M12 3.5c2.1 2.3 3.2 5.1 3.2 8.5S14.1 18.2 12 20.5M12 3.5C9.9 5.8 8.8 8.6 8.8 12s1.1 6.2 3.2 8.5" />
    </svg>
  );
}

function getLatestArticles() {
  return Object.values(getCatogorisedArticles())
    .flat()
    .sort((articleA, articleB) => {
      const [dayA, monthA, yearA] = articleA.date.split("-").map(Number);
      const [dayB, monthB, yearB] = articleB.date.split("-").map(Number);

      return (
        new Date(yearB, monthB - 1, dayB).getTime() -
        new Date(yearA, monthA - 1, dayA).getTime()
      );
    })
    .slice(0, 3);
}

export default function AboutUs() {
  const latestArticles = getLatestArticles();

  return (
    <main className="pp-main about-page">
      <AboutHero />

      <section className="about-pillars-section">
        <div className="about-pillars-grid">
          {pillars.map((pillar, index) => (
            <FadeInOnScroll
              key={pillar.eyebrow}
              delay={index * 80}
              distance={24}
              initialScale={0.98}
            >
              <article className="about-pillar-card">
                <div className="about-pillar-visual">
                  <Image
                    src={pillar.image}
                    alt=""
                    width={1024}
                    height={1024}
                    sizes="(max-width: 800px) calc(100vw - 40px), 33vw"
                  />
                </div>
                <div className="about-pillar-copy">
                  <span className="about-eyebrow">{pillar.eyebrow}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                  <Link href={pillar.link} className="about-text-link noLineHover">
                    {pillar.linkLabel} {ArrowSVG}
                  </Link>
                </div>
              </article>
            </FadeInOnScroll>
          ))}
        </div>
      </section>

      <AboutMission />

      <section className="about-team-section">
        <FadeInOnScroll distance={18} initialScale={0.99}>
          <span className="about-eyebrow">Meet the team</span>
        </FadeInOnScroll>

        <div className="about-team-grid">
          {team.map((member, index) => (
            <FadeInOnScroll
              key={member.name}
              delay={index * 70}
              distance={22}
              initialScale={0.98}
            >
              <article className="about-team-card">
                <div className="about-team-photo">
                  <Image
                    className={member.imageClass}
                    src={member.image}
                    alt={`${member.name}, ${member.role} at OptiFlowz`}
                    width={900}
                    height={900}
                    sizes="(max-width: 650px) calc(100vw - 56px), (max-width: 1050px) 50vw, 25vw"
                  />
                </div>
                <div className="about-team-copy">
                  <h3>{member.name}</h3>
                  <strong>{member.role}</strong>
                  <div className="about-team-socials" aria-label={`${member.name} social profiles`}>
                    {member.socials.map((social) => (
                      <a
                        className="about-team-social noLineHover"
                        key={social.type}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on ${socialLabels[social.type]}`}
                        title={`${member.name} on ${socialLabels[social.type]}`}
                      >
                        <TeamSocialIcon type={social.type} />
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            </FadeInOnScroll>
          ))}
        </div>
      </section>

      <section className="about-journal-section">
        <FadeInOnScroll distance={18} initialScale={0.99}>
          <div className="about-section-heading">
            <div>
              <span className="about-eyebrow">From Our Blog</span>
            </div>
            <Link className="about-text-link noLineHover" href="/blog">
              View all articles {ArrowSVG}
            </Link>
          </div>
        </FadeInOnScroll>
        <div className="about-journal-grid">
          {latestArticles.map((article, index) => (
            <FadeInOnScroll
              key={article.id}
              delay={index * 70}
              distance={22}
              initialScale={0.98}
            >
              <BlogArticleCard article={article} />
            </FadeInOnScroll>
          ))}
        </div>
      </section>
    </main>
  );
}
