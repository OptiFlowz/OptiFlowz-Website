'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowSVG } from "@/app/constants";
import MobileMenuButton from "./mobileButton";
import { socialLinks } from "@/lib/socialLinks";

const serviceLinks = [
  {
    href: "/services/custom-video-platform",
    label: "OptiFlowz Video Platform",
    image: "/services/CustomVideoPlatformBanner-v2.webp",
    zoomThumbnail: false,
  },
  {
    href: "/services/web-design-and-development",
    label: "Web Design & Development",
    image: "/services/WebDesignBanner-v2.webp",
    zoomThumbnail: false,
  },
  {
    href: "/services/business-automation",
    label: "Business Automation",
    image: "/services/BuAutomationBanner-v2.webp",
    zoomThumbnail: true,
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const servicesCloseTimeoutRef = useRef<number | null>(null);

  const closeMenu = useCallback(() => {
    // Move focus out before the drawer becomes inert/hidden.
    if (drawerRef.current?.contains(document.activeElement)) {
      const trigger = menuButtonRef.current;
      const returnTarget = trigger?.getClientRects().length ? trigger
        : trigger?.closest("header")?.querySelector<HTMLAnchorElement>(".headerBrand");
      returnTarget?.focus({ preventScroll: true });
    }
    setMenuOpen(false);
    setMobileServicesOpen(false);
    setServicesOpen(false);
  }, []);

  const clearServicesCloseTimeout = () => {
    if (servicesCloseTimeoutRef.current !== null) {
      window.clearTimeout(servicesCloseTimeoutRef.current);
      servicesCloseTimeoutRef.current = null;
    }
  };

  const openServicesMenu = () => {
    clearServicesCloseTimeout();
    setServicesOpen(true);
  };

  const scheduleServicesClose = () => {
    clearServicesCloseTimeout();
    servicesCloseTimeoutRef.current = window.setTimeout(() => {
      setServicesOpen(false);
      servicesCloseTimeoutRef.current = null;
    }, 240);
  };

  const toggleMenu = () => setMenuOpen((v) => !v);

  const router = useRouter();

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 36);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const scrollToContact = (e?: React.MouseEvent) => {
    e?.preventDefault();
    closeMenu();

    if (pathname !== "/")
      router.push("/#contactForm");
    else
      document.getElementById("contactForm")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!menuOpen) return;

    // Wait for the drawer's visibility and inert state to reach the browser.
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus({ preventScroll: true }));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 801px)");
    const onDesktop = () => { if (desktop.matches) closeMenu(); };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;
      const links = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      ) ?? []).filter(element => !element.closest('[inert]') && element.getClientRects().length > 0);
      const first = links[0];
      const last = links[links.length - 1];
      if (!drawerRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!servicesOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (servicesRef.current && !servicesRef.current.contains(target)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [servicesOpen]);

  useEffect(() => {
    return () => clearServicesCloseTimeout();
  }, []);

  const isServicesActive =
    pathname === "/pricing" ||
    pathname === "/services/custom-video-platform" ||
    pathname === "/services/web-design-and-development" ||
    pathname === "/services/business-automation";

  return (
    <>
      <header className={`siteHeader ${isScrolled ? "scrolled" : ""}`}>
        <Link href="/" className="headerBrand noLineHover" onClick={closeMenu} aria-label="OptiFlowz home">
          <Image
            className="headerLogo"
            src="/logo.webp"
            alt="Logo"
            width={48}
            height={48}
            priority
          />
          <span className="headerBrandCopy">
            <strong>OptiFlowz</strong>
          </span>
        </Link>

        <nav>
          <Link href="/" className={pathname === "/" ? "active" : ""}>
            Home
          </Link>

          <div
            className={`navDropdown ${servicesOpen ? "open" : ""}`}
            ref={servicesRef}
            onMouseEnter={openServicesMenu}
            onMouseLeave={scheduleServicesClose}
          >
            <button
              type="button"
              className={`navDropdownToggle ${isServicesActive ? "active" : ""}`}
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              onClick={() => {
                clearServicesCloseTimeout();
                setServicesOpen(true);
              }}
            >
              Services
              <span className="dropdownChevron" aria-hidden="true"></span>
            </button>

            <div className="navDropdownMenu" role="menu" aria-label="Services menu">
              {serviceLinks.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className={pathname === service.href ? "active" : ""}
                  role="menuitem"
                  onClick={() => setServicesOpen(false)}
                >
                  <span className="navServiceThumbFrame">
                    <Image
                      className={`navServiceThumb${service.zoomThumbnail ? " navServiceThumbZoomed" : ""}`}
                      src={service.image}
                      alt=""
                      width={122}
                      height={69}
                      sizes="122px"
                    />
                  </span>
                  <span className="navServiceLabel">{service.label}</span>
                  <span className="navServiceArrow" aria-hidden="true">{ArrowSVG}</span>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/about-us" className={pathname === "/about-us" ? "active" : ""}>
            About Us
          </Link>

          <Link href="/blog" className={pathname === "/blog" ? "active" : ""}>
            Blog
          </Link>
        </nav>

        <Link
          href="/#contactForm"
          className="button desktopContactButton"
          onClick={scrollToContact}
        >
          <span className="-mr-0.75! inline max-[950px]:hidden">Get In</span>Contact{ArrowSVG}
        </Link>

        <MobileMenuButton onClick={toggleMenu} isOpen={menuOpen} buttonRef={menuButtonRef} />
      </header>

      <div
        className={`mobileMenuOverlay ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div
        id="mobile-drawer"
        className={`mobileDrawer ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal={menuOpen ? true : undefined}
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div ref={drawerRef} className="mobileDrawerInner">
          <div className="mobileDrawerTop">
            <Link href="/" className="mobileDrawerBrand" onClick={closeMenu} aria-label="OptiFlowz home">
              <Image src="/logo.webp" alt="" width={38} height={38} />
              <span>
                <strong>OptiFlowz</strong>
              </span>
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              className="mobileCloseButton"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="mobileLinks" aria-label="Mobile navigation">
            <Link href="/" className={pathname === "/" ? "active" : ""} aria-current={pathname === "/" ? "page" : undefined} onClick={closeMenu}>
              <span className="mobileNavLabel">Home</span>
            </Link>

            <div className="mobileServicesGroup">
              <button
                type="button"
                className={`mobileServicesButton ${mobileServicesOpen ? "open" : ""} ${isServicesActive ? "active" : ""}`}
                aria-expanded={mobileServicesOpen}
                aria-controls="mobile-services-menu"
                onClick={() => setMobileServicesOpen((v) => !v)}
              >
                <span className="mobileNavLabel">Services</span>
                <span className="mobileServicesIndicator" aria-hidden="true" />
              </button>

              <div id="mobile-services-menu" className={`mobileServicesMenu ${mobileServicesOpen ? "open" : ""}`} inert={!mobileServicesOpen}>
                <div className="mobileServicesList">
                  {serviceLinks.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={pathname === service.href ? "active" : ""}
                      aria-current={pathname === service.href ? "page" : undefined}
                      onClick={closeMenu}
                    >
                      <span className="mobileServiceThumbFrame">
                        <Image
                          className={service.zoomThumbnail ? "mobileServiceThumbZoomed" : ""}
                          src={service.image}
                          alt=""
                          width={112}
                          height={64}
                          sizes="56px"
                        />
                      </span>
                      <span>{service.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/about-us"
              className={pathname === "/about-us" ? "active" : ""}
              aria-current={pathname === "/about-us" ? "page" : undefined}
              onClick={closeMenu}
            >
              <span className="mobileNavLabel">About Us</span>
            </Link>

            <Link
              href="/blog"
              className={pathname === "/blog" ? "active" : ""}
              aria-current={pathname === "/blog" ? "page" : undefined}
              onClick={closeMenu}
            >
              <span className="mobileNavLabel">Blog</span>
            </Link>

            <Link
              href="/#contactForm"
              className="contactLink"
              onClick={scrollToContact}
            >
              <span className="mobileNavLabel">Contact</span>
            </Link>
          </nav>

          <div className="mobileDrawerBottom">
            <a className="mobileDrawerEmail" href="mailto:office@optiflowz.com">office@optiflowz.com</a>
            <div className="mobileDrawerSocials" aria-label="OptiFlowz social profiles">
              {socialLinks.map(social => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                  <Image src={social.icon} alt="" width={22} height={22} />
                </a>
              ))}
            </div>
            <Link className="mobileDrawerPrivacy" href="/privacy-policy" aria-current={pathname === "/privacy-policy" ? "page" : undefined} onClick={closeMenu}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
