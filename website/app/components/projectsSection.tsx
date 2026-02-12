"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [arrowY, setArrowY] = useState(0);
  const [activeDots, setActiveDots] = useState<Set<number>>(new Set([]));
  const [visibleSections, setVisibleSections] = useState<Set<number>>(
    new Set()
  );
  const dotPositions = useRef<number[]>([]);
  //TRACK ARROR DIRECTION
  const [isDirectionUp, setIsDirectionUp] = useState(false);
  const isDirectionUpRef = useRef(false);
  const lastDirection = useRef(0);

  const recalcDots = useCallback(() => {
    const dots = document.querySelectorAll(".tl-dot");
    const timeline = timelineRef.current;
    if (!timeline || dots.length === 0) return;
    const timelineRect = timeline.getBoundingClientRect();
    const positions: number[] = [];
    dots.forEach((dot) => {
      const dotRect = (dot as HTMLElement).getBoundingClientRect();
      positions.push(
        dotRect.top - timelineRect.top + dotRect.height / 2
      );
    });

    dotPositions.current = positions;
  }, []);

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

  useEffect(() => {
    recalcDots();

    const handleScroll = () => {
      if (!sectionRef.current || !timelineRef.current) return;

      // recalcDots();

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const timelineHeight = timelineRect.height;

      const viewportTrigger = window.innerHeight * 0.35;
      const scrolledInto = viewportTrigger - sectionRect.top;
      const totalScrollable =
        sectionRect.height - window.innerHeight * 0.5;

      const progress = Math.min(
        Math.max(scrolledInto / totalScrollable, 0),
        1
      );

      const isScrollingUp = progress < lastDirection.current;
      if (isScrollingUp !== isDirectionUpRef.current) {
        isDirectionUpRef.current = isScrollingUp;
        setIsDirectionUp(isScrollingUp);
      }
      lastDirection.current = progress;
      
      const newArrowY = progress * timelineHeight;
      setArrowY(newArrowY);

      const newActive = activeDots;
      dotPositions.current.forEach((pos, i) => {
        console.log("posiion: " + pos)

        if (!activeDots.has(i) && newArrowY >= pos - 17) 
          newActive.add(i);
        else if(i != 0 && activeDots.has(i) && newArrowY < pos + 17)
          newActive.delete(i);
      });
      setActiveDots(newActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", recalcDots);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", recalcDots);
    };
  }, [recalcDots]);

  return (
    <section className="projects-section" ref={sectionRef}>
      <div className="projects-timeline-layout">
        {/* Timeline */}
        <div className="tl-track" ref={timelineRef}>
          <div className="tl-dashed-line" />

          {/* Scrolling arrow */}
          <div
            className={`tl-arrow ${arrowY > 0 ? "active" : ""} ${isDirectionUp ? "up" : ''}`}
            style={{ top: `${arrowY}px` }}
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
          <div
            className={`tl-dot tl-dot-0 ${activeDots.has(0) ? `active` : ""}`}
            style={{top: `${activeDots.has(0) ? arrowY-7 : '-7'}px`}}
          />
          <div
            className={`tl-dot tl-dot-1 ${activeDots.has(1) ? "active" : ""}`}
            style={{top: `${activeDots.has(1) ? arrowY-7 : "calc(25% + 20px)"}px`}}
          />
          <div
            className={`tl-dot tl-dot-2 ${activeDots.has(2) ? "active" : ""}`}
            style={{top: `${activeDots.has(2) ? arrowY-7 : "calc(55% + 10px)"}px`}}
          />
          <div
            className={`tl-dot tl-dot-3 ${activeDots.has(3) ? "active" : ""}`}
            style={{top: `${activeDots.has(3) ? arrowY-7 : "calc(82% + 10px)"}px`}}
          />
        </div>

        {/* Content */}
        <div className="projects-content">
          {/* Our Projects - Section 0 */}
          <div className="project-card-wrapper visible">
            <div className="projects-intro">
              <h2 className="projects-title">Our Projects</h2>
              <p className="projects-subtitle">
                Explore how we help industry leaders scale through custom
                engineering and high-performance digital solutions.
              </p>
            </div>
          </div>

          {/* EAES Video Corner - Section 1 */}
          <div
            className={`project-card-wrapper ${visibleSections.has(1) ? "visible" : ""}`}
          >
            <div className="project-label">
              <h3>EAES Video Corner</h3>
            </div>
            <div className="project-card">
              <div className="project-card-preview">
                <div className="project-logo-badge">
                  <span className="eaes-logo-text">EAES</span>
                  <span className="eaes-logo-sub">video corner</span>
                </div>
                <div className="project-mockup">
                  <img
                    src="/eaes-mockup.webp"
                    alt="EAES Video Corner Platform"
                    className="mockup-image"
                  />
                </div>
              </div>
              <div className="project-card-info">
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
                <div className="project-tags">
                  <span className="tag">React</span>
                  <span className="tag">Video Streaming</span>
                  <span className="tag">EdTech</span>
                </div>
                <a href="#" className="visit-btn">
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
          <div
            className={`project-card-wrapper ${visibleSections.has(2) ? "visible" : ""}`}
          >
            <div className="project-label">
              <h3>SAES Membership system</h3>
            </div>
            <div className="project-card">
              <div className="project-card-preview">
                <div className="project-mockup">
                  <img
                    src="/saes-mockup.webp"
                    alt="SAES Membership System"
                    className="mockup-image"
                  />
                </div>
              </div>
              <div className="project-card-info">
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
                <div className="project-tags">
                  <span className="tag">Wordpress</span>
                  <span className="tag">FinTech</span>
                  <span className="tag">EdTech</span>
                </div>
                <a href="#" className="visit-btn">
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
              <h3>You could be next...</h3>
            </div>
            <div className="contact-card">
              <div className="contact-left">
                <h4>Contact us</h4>
                <p>
                  Have a project in mind? Fill out the form to share your
                  vision with us. We&apos;re here to help bring your ideas
                  to life.
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
                <form
                  className="contact-form"
                  onSubmit={(e) => e.preventDefault()}
                >
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
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email..."
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message*</label>
                    <textarea
                      id="message"
                      placeholder="Enter message..."
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="send-btn">
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
        </div>
      </div>
    </section>
  );
}