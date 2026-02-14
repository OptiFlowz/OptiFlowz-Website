"use client";

import { useState, useCallback, useRef } from "react";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

function ContactFormInner() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
          formRef.current.reset();
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

  return (
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

        <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name*</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name..."
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