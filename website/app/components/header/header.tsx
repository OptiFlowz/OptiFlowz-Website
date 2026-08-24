'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowSVG } from "@/app/constants";
import MobileMenuButton from "./mobileButton";

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
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const servicesCloseTimeoutRef = useRef<number | null>(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileServicesOpen(false);
    setServicesOpen(false);
  };

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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        setServicesOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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

  useEffect(() => {
    if (!menuOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (drawerRef.current && !drawerRef.current.contains(target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [menuOpen]);

  return (
    <>
      <header className={`siteHeader ${isScrolled ? "scrolled" : ""}`}>
        <Link href="/" onClick={closeMenu}>
          <Image
            className="headerLogo"
            src="/logo.webp"
            alt="Logo"
            width={48}
            height={48}
            priority
          />
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

        <MobileMenuButton onClick={toggleMenu} isOpen={menuOpen} />
      </header>

      <div
        className={`mobileMenuOverlay ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <nav
        id="mobile-drawer"
        className={`mobileDrawer ${menuOpen ? "open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div ref={drawerRef} className="mobileDrawerInner">
          <div className="mobileDrawerTop">
            <Link href="/" className="mobileDrawerBrand" onClick={closeMenu}>
              <Image src="/logo.webp" alt="OptiFlowz" width={42} height={42} />
              <span>
                <strong>OptiFlowz</strong>
                <small>Digital experiences</small>
              </span>
            </Link>
            <button
              className="mobileCloseButton"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="mobileLinks">
            <Link href="/" className={pathname === "/" ? "active" : ""} onClick={closeMenu}>
              Home
            </Link>

            <div className="mobileServicesGroup">
              <button
                type="button"
                className={`mobileServicesButton ${mobileServicesOpen ? "open" : ""} ${isServicesActive ? "active" : ""}`}
                aria-expanded={mobileServicesOpen}
                onClick={() => setMobileServicesOpen((v) => !v)}
              >
                Services
                <span className="dropdownChevron" aria-hidden="true"></span>
              </button>

              <div className={`mobileServicesMenu ${mobileServicesOpen ? "open" : ""}`}>
                {serviceLinks.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className={pathname === service.href ? "active" : ""}
                    onClick={closeMenu}
                  >
                    <span className="mobileServiceThumbFrame">
                      <Image
                        className={service.zoomThumbnail ? "mobileServiceThumbZoomed" : ""}
                        src={service.image}
                        alt=""
                        width={72}
                        height={41}
                        sizes="72px"
                      />
                    </span>
                    <span>{service.label}</span>
                    <span className="mobileServiceArrow" aria-hidden="true">{ArrowSVG}</span>
                  </Link>
                ))}

              </div>
            </div>

            <Link
              href="/about-us"
              className={pathname === "/about-us" ? "active" : ""}
              onClick={closeMenu}
            >
              About Us
            </Link>

            <Link
              href="/blog"
              className={pathname === "/blog" ? "active" : ""}
              onClick={closeMenu}
            >
              Blog
            </Link>

            <Link
              href="/privacy-policy"
              className={pathname === "/privacy-policy" ? "active" : ""}
              onClick={closeMenu}
            >
              Privacy Policy
            </Link>

            <Link
              href="#contactForm"
              className="contactLink"
              onClick={scrollToContact}
            >
              Get In Contact {ArrowSVG}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
