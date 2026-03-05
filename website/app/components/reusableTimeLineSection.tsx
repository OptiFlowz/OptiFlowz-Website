"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TimelineButton = {
  href: string;
  label: string;
  targetBlank?: boolean; // default true
};

export type TimelineSectionItem = {
  /** Tekst iznad kartice (npr "EAES Video Corner") */
  label?: string;

  /** Veliki naslov u kartici (npr "Custom Video Platform...") */
  title?: string;

  /** Opis: string ili više paragrafa */
  description?: string | string[];

  /** Slika sa leve strane */
  image?: {
    src: string;
    alt: string;
  };

  /** Tagovi ispod opisa */
  tags?: string[];

  /** Dugme (opciono) */
  button?: TimelineButton;

  /**
   * Ako želiš skroz custom sadržaj za sekciju (npr ContactForm),
   * samo prosledi render i komponenta će ga prikazati umesto standardne kartice.
   */
  render?: React.ReactNode;

  /**
   * Ako želiš da neka sekcija bude uvek vidljiva (npr uvod),
   * setuj true.
   */
  alwaysVisible?: boolean;
};

type Props = {
  /** Naslov/intro kao prva “sekcija” (najčešće) */
  intro?: {
    heading: string;
    subheading?: string;
  };

  /** Niz sekcija (projekti / blokovi) */
  sections: TimelineSectionItem[];

  /** SVG za “check/arrow” ikonice u dotovima (tvoj ArrowSVG) */
  dotIcon?: React.ReactNode;

  /** Opcioni className da uklopiš u tvoj CSS */
  className?: string;
};

const ExternalLinkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function ReusableTimelineSection({
  intro,
  sections,
  dotIcon,
  className,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Fade-in
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

  // Dot positions (px inside timeline)
  const [dotTops, setDotTops] = useState<number[]>([]);
  const dotPositionsRef = useRef<number[]>([]);

  // Active dots
  const [activeDots, setActiveDots] = useState<Set<number>>(new Set());

  // Smooth arrow motion
  const targetY = useRef(0);
  const currentY = useRef(0);

  // Arrow direction
  const [isDirectionUp, setIsDirectionUp] = useState(false);
  const directionRef = useRef(false);
  const lastRawYRef = useRef(0);

  const setsEqual = (a: Set<number>, b: Set<number>) => {
    if (a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  };

  // offsetTop helper (ignores transforms)
  const getOffsetTopWithin = (el: HTMLElement, ancestor: HTMLElement) => {
    let top = 0;
    let node: HTMLElement | null = el;

    while (node && node !== ancestor) {
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return top;
  };

  const recalcDots = useCallback(() => {
    const timeline = timelineRef.current;
    const section = sectionRef.current;
    if (!timeline || !section) return;

    const anchors = section.querySelectorAll<HTMLElement>("[data-tl-anchor]");
    if (!anchors.length) return;

    const timelineTopInSection = getOffsetTopWithin(timeline, section as unknown as HTMLElement);

    const positions = Array.from(anchors).map((el) => {
      const anchorTopInSection = getOffsetTopWithin(el, section as unknown as HTMLElement);
      const anchorCenterInSection = anchorTopInSection + el.offsetHeight / 2;
      return anchorCenterInSection - timelineTopInSection; // px inside timeline
    });

    dotPositionsRef.current = positions;
    setDotTops(positions);
  }, []);

  // refs za wrappere da izbegnemo document.querySelectorAll
  const wrappersRef = useRef<Array<HTMLDivElement | null>>([]);

  // Fade-in observers
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    wrappersRef.current.forEach((el, index) => {
      if (!el) return;

      // ako je alwaysVisible - odmah “visible”
      if (sections[index]?.alwaysVisible) {
        setVisibleSections((prev) => new Set([...prev, index]));
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        },
        { threshold: 0.15 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  // Recalc when sections reveal (because transforms go to 0)
  useEffect(() => {
    requestAnimationFrame(() => recalcDots());
    const t = setTimeout(() => recalcDots(), 700); // match transition
    return () => clearTimeout(t);
  }, [visibleSections, recalcDots]);

  // Smooth arrow + active dots
  useEffect(() => {
    const arrow = arrowRef.current;
    const section = sectionRef.current;
    if (!arrow || !section) return;

    let raf = 0;
    let isVisible = false;

    const loop = () => {
      const dy = targetY.current - currentY.current;
      currentY.current += dy * 0.12;

      arrow.style.top = `${currentY.current}px`;

      const firstDot = dotPositionsRef.current[0];
      if (typeof firstDot === "number") {
        const HIDE_OFFSET = 1;
        const shouldHide = currentY.current < firstDot - HIDE_OFFSET;
        arrow.classList.toggle("hiddenDot", shouldHide);
      }

      const pos = dotPositionsRef.current;
      const next = new Set<number>();
      for (let i = 0; i < pos.length; i++) {
        if (currentY.current >= pos[i] - 8) next.add(i);
      }

      setActiveDots((prev) => (setsEqual(prev, next) ? prev : next));

      if (isVisible) raf = requestAnimationFrame(loop);
      else raf = 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible && raf === 0) raf = requestAnimationFrame(loop);
        else if (!isVisible && raf !== 0) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll -> compute targetY
  useEffect(() => {
    recalcDots();

    const handleScroll = () => {
      const section = sectionRef.current;
      const timeline = timelineRef.current;
      if (!section || !timeline) return;

      const sectionRect = section.getBoundingClientRect();
      const timelineRect = timeline.getBoundingClientRect();
      const timelineHeight = timelineRect.height;

      const viewportTrigger = window.innerHeight * 0.25;
      const scrolledInto = viewportTrigger - sectionRect.top;
      const totalScrollable = sectionRect.height - window.innerHeight * 0.4;

      const progress = Math.min(Math.max(scrolledInto / totalScrollable, 0), 1);
      const rawY = progress * timelineHeight;

      const isUp = rawY < lastRawYRef.current;
      lastRawYRef.current = rawY;
      if (isUp !== directionRef.current) {
        directionRef.current = isUp;
        setIsDirectionUp(isUp);
      }

      targetY.current = rawY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", recalcDots);

    requestAnimationFrame(() => recalcDots());
    setTimeout(() => recalcDots(), 50);
    window.addEventListener("load", recalcDots);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", recalcDots);
      window.removeEventListener("load", recalcDots);
    };
  }, [recalcDots]);

  const introBlock = useMemo(() => {
    if (!intro) return null;
    return (
      <div className="project-card-wrapper visible">
        <div className="projects-intro">
          <h2 className="projects-title" data-tl-anchor>
            {intro.heading}
          </h2>
          {intro.subheading ? <p className="projects-subtitle">{intro.subheading}</p> : null}
        </div>
      </div>
    );
  }, [intro]);

  return (
    <div className={`projects-section no-padding-mobile ${className ?? ""}`} ref={sectionRef}>
      <div className="projects-timeline-layout">
        {/* Timeline */}
        <div className="tl-track" ref={timelineRef}>
          <div className="tl-dashed-line" />

          {/* Scrolling arrow */}
          <div
            ref={arrowRef}
            className={`tl-arrow ${isDirectionUp ? "up" : ""}`}
            style={{ top: "0px" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9 2L9 16M9 16L4 11M9 16L14 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Dots */}
          {dotTops.map((top, i) => (
            <div
              key={i}
              className={`tl-dot ${activeDots.has(i) ? "active" : ""}`}
              style={{ top: `${top}px` }}
            >
              {dotIcon ?? null}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="projects-content">
          {introBlock}

          {sections.map((s, index) => {
            const isVisible = s.alwaysVisible || visibleSections.has(index);
            return (
              <div
                key={index}
                ref={(el) => {
                  wrappersRef.current[index] = el;
                }}
                className={`project-card-wrapper ${isVisible ? "visible" : ""} ${
                  s.render ? "relative" : ""
                }`}
              >
                {s.label ? (
                  <div className="project-label">
                    <h3 data-tl-anchor>{s.label}</h3>
                  </div>
                ) : (
                  // ako nema label, a ipak želiš anchor za dot:
                  <span data-tl-anchor style={{ display: "none" }} />
                )}

                {s.render ? (
                  s.render
                ) : (
                  <div className="project-card">
                    {s.image ? (
                      <img src={s.image.src} alt={s.image.alt} className="mockup-image" />
                    ) : null}

                    <div className="project-card-info">
                      <div className="project-card-about">
                        {s.title ? <h4>{s.title}</h4> : null}

                        {Array.isArray(s.description) ? (
                          s.description.map((p, i) => <p key={i}>{p}</p>)
                        ) : s.description ? (
                          <p>{s.description}</p>
                        ) : null}
                      </div>

                      {s.tags?.length ? (
                        <div className="project-tags">
                          {s.tags.map((t) => (
                            <span key={t} className="tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {s.button ? (
                        <a
                          href={s.button.href}
                          target={s.button.targetBlank === false ? undefined : "_blank"}
                          rel={s.button.targetBlank === false ? undefined : "noreferrer"}
                          className="button"
                        >
                          {s.button.label} <ExternalLinkIcon />
                        </a>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}