"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowSVG } from "../constants";

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Fade-in cards
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

    const timelineTopInSection = getOffsetTopWithin(timeline, section);

    const positions = Array.from(anchors).map((el) => {
      const anchorTopInSection = getOffsetTopWithin(el, section);
      const anchorCenterInSection = anchorTopInSection + el.offsetHeight / 2;
      return anchorCenterInSection - timelineTopInSection; // px inside timeline
    });

    dotPositionsRef.current = positions;
    setDotTops(positions);
  }, []);

  // Fade-in observers
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const cards = document.querySelectorAll(".project-card-wrapper");

    cards.forEach((card, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        },
        { threshold: 0.15 }
      );

      observer.observe(card);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Recalc when sections reveal (because transforms go to 0)
  useEffect(() => {
    requestAnimationFrame(() => recalcDots());
    const t = setTimeout(() => recalcDots(), 700); // match your 0.7s transition
    return () => clearTimeout(t);
  }, [visibleSections, recalcDots]);

  // Smooth arrow + active dots (optimized with IntersectionObserver)
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

      if (isVisible) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    // IntersectionObserver to detect if section is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible && raf === 0) {
          raf = requestAnimationFrame(loop);
        } else if (!isVisible && raf !== 0) {
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


  // Scroll -> compute targetY (NO morphing)
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

      // direction (based on rawY)
      const isUp = rawY < lastRawYRef.current;
      lastRawYRef.current = rawY;
      if (isUp !== directionRef.current) {
        directionRef.current = isUp;
        setIsDirectionUp(isUp);
      }

      // direct target (no magnet/snap/morph)
      targetY.current = rawY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", recalcDots);

    // Ensure correct measurements after layout/fonts/images
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

  return (
    <section className="projects-section" ref={sectionRef}>
      <div className="grid-wrapper">
        <span></span>
        <span></span>
      </div>
      <div className="projects-timeline-layout">
        {/* Timeline */}
        <div className="tl-track" ref={timelineRef}>
          <div className="tl-dashed-line" />

          {/* Scrolling arrow */}
          <div
            ref={arrowRef}
            className={`tl-arrow ${isDirectionUp ? "up" : ""}`}
            style={{ top: "0px" }} // updated via rAF
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
              {ArrowSVG}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="projects-content">
          {/* Our Projects - Section 0 */}
          <div className="project-card-wrapper visible">
            <div className="projects-intro">
              <h2 className="projects-title" data-tl-anchor>
                Our Projects
              </h2>
              <p className="projects-subtitle">
                Explore how we help industry leaders scale through custom
                engineering and high-performance digital solutions.
              </p>
            </div>
          </div>

          {/* EAES Video Corner - Section 1 */}
          <div className={`project-card-wrapper ${visibleSections.has(1) ? "visible" : ""}`}>
            <div className="project-label">
              <h3 data-tl-anchor>EAES Video Corner</h3>
            </div>
            <div className="project-card">
              <img
                src="/eaes-mockup.webp"
                alt="EAES Video Corner Platform"
                className="mockup-image"
              />
              <div className="project-card-info">
                <div className="project-card-about">
                  <h4>Custom Video Platform for Surgical Education</h4>
                  <p>
                    Developed for EAES, VideoCorner is a custom streaming
                    platform serving surgical education across Europe.
                  </p>
                  <p>
                    We built a scalable infrastructure to host complex medical
                    curricula and deliver high-performance video content to
                    thousands of professionals.
                  </p>
                </div>
                <div className="project-tags">
                  <span className="tag">React</span>
                  <span className="tag">Video Streaming</span>
                  <span className="tag">EdTech</span>
                </div>
                <a
                  href="https://videocorner.eaes.eu/"
                  target="_blank"
                  rel="noreferrer"
                  className="button"
                >
                  Visit website
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* SAES Membership System - Section 2 */}
          <div className={`project-card-wrapper ${visibleSections.has(2) ? "visible" : ""}`}>
            <div className="project-label">
              <h3 data-tl-anchor>SAES Membership system</h3>
            </div>
            <div className="project-card">
              <img
                src="/saes-mockup.webp"
                alt="SAES Membership System"
                className="mockup-image"
              />
              <div className="project-card-info">
                <div className="project-card-about">
                  <h4>Course &amp; Certification System</h4>
                  <p>
                    A custom platform for the Association of Endoscopic
                    Surgeons of Serbia (UEHS).
                  </p>
                  <p>
                    We built an integrated course system for managing
                    educational programs and automated certification,
                    simplifying their entire training and tracking process.
                  </p>
                </div>
                <div className="project-tags">
                  <span className="tag">Wordpress</span>
                  <span className="tag">FinTech</span>
                  <span className="tag">EdTech</span>
                </div>
                <a
                  href="https://uehs.org.rs/"
                  target="_blank"
                  rel="noreferrer"
                  className="button"
                >
                  Visit website
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* You could be next - Section 3 */}
          <div
            id="contactForm"
            className={`project-card-wrapper ${visibleSections.has(3) ? "visible" : ""}`}
          >
            <div className="project-label">
              <h3 data-tl-anchor>You could be next...</h3>
            </div>

            <div className="contact-card">
              <div className="contact-left">
                <h4>Contact us</h4>
                <p>
                  Have a project in mind? Fill out the form to share your vision
                  with us. We&apos;re here to help bring your ideas to life.
                </p>
                <div className="contact-logo">
                  <img
                    src="/logo.webp"
                    alt="OptiFlowz Logo"
                    className="contact-logo-img"
                  />
                </div>
              </div>

              <div className="contact-right">
                <div className="contact-form-header">
                  <div className="form-dots">
                    <span className="form-dot" />
                    <span className="form-dot" />
                    <span className="form-dot" />
                  </div>
                </div>

                <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name*</label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Enter your full name..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email*</label>
                    <input type="email" id="email" placeholder="Enter your email..." />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message*</label>
                    <textarea
                      id="message"
                      placeholder="Enter message..."
                      rows={4}
                    />
                  </div>

                  <button type="submit" className="button self-end white">
                    Send Message
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* /Section 3 */}
        </div>
        {/* /projects-content */}
      </div>
    </section>
  );
}