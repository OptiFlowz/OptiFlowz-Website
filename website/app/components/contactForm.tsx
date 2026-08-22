"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal, flushSync } from "react-dom";
import Image from "next/image";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

function ContactFormInner() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [windowMode, setWindowMode] = useState<"normal" | "fullscreen" | "collapsed">("normal");
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const contactCardRef = useRef<HTMLDivElement>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modeTransitionCleanupRef = useRef<(() => void) | null>(null);

  const isFullscreen = windowMode === "fullscreen";
  const isCollapsed = windowMode === "collapsed";

  const changeWindowMode = useCallback(
    (nextMode: "normal" | "fullscreen" | "collapsed") => {
      const viewTransitionDocument = document as Document & {
        startViewTransition?: (update: () => void) => unknown;
      };
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        setWindowMode(nextMode);
        return;
      }

      if (!viewTransitionDocument.startViewTransition) {
        const sourceWindow = contactCardRef.current;
        const sourceRect = sourceWindow?.getBoundingClientRect();
        const sourceRadius = sourceWindow ? getComputedStyle(sourceWindow).borderRadius : "15px";

        modeTransitionCleanupRef.current?.();
        flushSync(() => setWindowMode(nextMode));

        const targetWindow = contactCardRef.current;
        if (!sourceRect || !targetWindow) return;

        const previousStyles = {
          transition: targetWindow.style.transition,
          transform: targetWindow.style.transform,
          transformOrigin: targetWindow.style.transformOrigin,
          borderRadius: targetWindow.style.borderRadius,
          opacity: targetWindow.style.opacity,
        };

        targetWindow.style.transition = "none";
        void targetWindow.offsetWidth;
        const targetRect = targetWindow.getBoundingClientRect();
        const targetRadius = getComputedStyle(targetWindow).borderRadius;

        const translateX = sourceRect.left - targetRect.left;
        const translateY = sourceRect.top - targetRect.top;
        const scaleX = sourceRect.width / targetRect.width;
        const scaleY = sourceRect.height / targetRect.height;

        targetWindow.style.transformOrigin = "top left";
        targetWindow.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
        targetWindow.style.borderRadius = sourceRadius;
          targetWindow.style.opacity = "1";
        void targetWindow.offsetWidth;

        let animationFrame = 0;
        let cleanupTimeout: ReturnType<typeof setTimeout> | null = null;

        const cleanup = () => {
          if (animationFrame) cancelAnimationFrame(animationFrame);
          if (cleanupTimeout) clearTimeout(cleanupTimeout);
          targetWindow.style.transition = previousStyles.transition;
          targetWindow.style.transform = previousStyles.transform;
          targetWindow.style.transformOrigin = previousStyles.transformOrigin;
          targetWindow.style.borderRadius = previousStyles.borderRadius;
          targetWindow.style.opacity = previousStyles.opacity;
          if (modeTransitionCleanupRef.current === cleanup) {
            modeTransitionCleanupRef.current = null;
          }
        };

        modeTransitionCleanupRef.current = cleanup;
        animationFrame = requestAnimationFrame(() => {
          targetWindow.style.transition = [
            "transform 0.36s cubic-bezier(0.2, 0.8, 0.2, 1)",
            "border-radius 0.36s cubic-bezier(0.2, 0.8, 0.2, 1)",
          ].join(", ");
          targetWindow.style.transform = "translate(0, 0) scale(1, 1)";
          targetWindow.style.borderRadius = targetRadius;
          targetWindow.style.opacity = "1";
        });

        cleanupTimeout = setTimeout(cleanup, 430);
        return;
      }

      viewTransitionDocument.startViewTransition(() => {
        flushSync(() => setWindowMode(nextMode));
      });
    },
    []
  );

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") changeWindowMode("normal");
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen, changeWindowMode]);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    const resizeTimeout = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 360);

    return () => clearTimeout(resizeTimeout);
  }, [windowMode]);

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      modeTransitionCleanupRef.current?.();
    };
  }, []);

  const playCloseAnimation = () => {
    const card = contactCardRef.current;
    if (!card) return;

    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    card.classList.remove("is-shaking");
    void card.offsetWidth;
    card.classList.add("is-shaking");

    shakeTimeoutRef.current = setTimeout(() => {
      card.classList.remove("is-shaking");
    }, 520);
  };

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setLoading(true);
      setStatus(null);

      if (!executeRecaptcha || !formRef.current) {
        setStatus("reCAPTCHA not ready.");
        setLoading(false);
        return;
      }

      const captchaToken = await executeRecaptcha("contact_form");
      const formData = new FormData(formRef.current);

      try {
        const res = await fetch(
          "https://n8n.srv785100.hstgr.cloud/webhook/ec3f8117-75a0-453a-8e99-4d01b61a8333",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName: formData.get("fullName"),
              email: formData.get("email"),
              message: formData.get("message"),
              captchaToken,
            }),
          }
        );

        if (res.ok) {
          setStatus("Message sent successfully!");
          setFormValues({ fullName: "", email: "", message: "" });
        } else {
          setStatus("Error sending message.");
        }
      } catch {
        setStatus("Error sending message.");
      } finally {
        setLoading(false);
      }
    },
    [executeRecaptcha]
  );

  const contactWindow = (
    <div
      ref={contactCardRef}
      className={`contact-card contact-window is-${windowMode}`}
      role={isFullscreen ? "dialog" : undefined}
      aria-modal={isFullscreen ? true : undefined}
      aria-label={isFullscreen ? "Contact form" : undefined}
    >
      <div className="contact-left">
        <h4>Contact us</h4>
        <p>
          Have a project in mind? Fill out the form to share your vision
          with us. We&apos;re here to help bring your ideas to life.
        </p>
        <div className="contact-logo">
          <Image
            src="/logo.webp"
            alt="OptiFlowz Logo"
            className="contact-logo-img"
            width={40}
            height={40}
            sizes="40px"
          />
        </div>
      </div>

      <div className="contact-right">
        <div className="contact-form-header">
          <div className="form-dots" aria-label="Contact form window controls">
            <button
              type="button"
              className="form-dot window-control window-control-red"
              aria-label="Play close animation"
              title="Close"
              onClick={playCloseAnimation}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M3 3l6 6M9 3L3 9" />
              </svg>
            </button>
            <button
              type="button"
              className="form-dot window-control window-control-yellow"
              aria-label={isCollapsed ? "Expand contact form" : "Collapse contact form"}
              title={isCollapsed ? "Expand" : "Collapse"}
              onClick={() => changeWindowMode(isCollapsed ? "normal" : "collapsed")}
            >
              {isCollapsed ? (
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2.5 6h7M6 2.5v7" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2.5 6h7" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="form-dot window-control window-control-green"
              aria-label={isFullscreen ? "Exit fullscreen contact form" : "Open fullscreen contact form"}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              onClick={() => changeWindowMode(isFullscreen ? "normal" : "fullscreen")}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2.5 5V2.5H5M7 2.5h2.5V5M9.5 7v2.5H7M5 9.5H2.5V7" />
              </svg>
            </button>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name*</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name..."
              value={formValues.fullName}
              onChange={(event) =>
                setFormValues((values) => ({ ...values, fullName: event.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email..."
              value={formValues.email}
              onChange={(event) =>
                setFormValues((values) => ({ ...values, email: event.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message*</label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter message..."
              rows={4}
              value={formValues.message}
              onChange={(event) =>
                setFormValues((values) => ({ ...values, message: event.target.value }))
              }
              required
            />
          </div>

          <div className="text-[0.7rem]">
            This site is protected by reCAPTCHA and the Google&nbsp;
            <a className="link" href="https://policies.google.com/privacy">Privacy Policy</a> and&nbsp;
            <a className="link" href="https://policies.google.com/terms">Terms of Service</a> apply.
          </div>

          {status && <p className="form-status">{status}</p>}

          <button
            type="submit"
            className="button self-end white"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
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
  );

  return isFullscreen ? createPortal(contactWindow, document.body) : contactWindow;
}

export default function ContactForm() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!}
    >
      <ContactFormInner />
    </GoogleReCaptchaProvider>
  );
}
