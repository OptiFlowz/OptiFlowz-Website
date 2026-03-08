'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowSVG } from "@/app/constants";
import MobileMenuButton from "./mobileButton";

export default function Header() {
  const pathname = usePathname();
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
    }, 190);
  };

  const toggleMenu = () => setMenuOpen((v) => !v);

  const router = useRouter();

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
      <header>
        <Link href="/" onClick={closeMenu}>
          <Image
            src="/logo.webp"
            alt="Logo"
            width={100}
            height={100}
            style={{ width: "40px", height: "40px" }}
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
                setServicesOpen((v) => !v);
              }}
            >
              Services
              <span className="dropdownChevron" aria-hidden="true"></span>
            </button>

            <div className="navDropdownMenu" role="menu" aria-label="Services menu">
              <Link
                href="/services/custom-video-platform"
                className={pathname === "/services/custom-video-platform" ? "active" : ""}
                role="menuitem"
                onClick={() => setServicesOpen(false)}
              >
                Custom Video Platform
              </Link>

              <Link
                href="/services/web-design-and-development"
                className={pathname === "/services/web-design-and-development" ? "active" : ""}
                role="menuitem"
                onClick={() => setServicesOpen(false)}
              >
                Web Design & Development
              </Link>

              <Link
                  href="/services/business-automation"
                  className={pathname === "/services/business-automation" ? "active" : ""}
                  role="menuitem"
                  onClick={() => setServicesOpen(false)}
                >
                Business Automation
              </Link>

              <Link
                href="/pricing"
                className={pathname === "/pricing" ? "active" : ""}
                role="menuitem"
                onClick={() => setServicesOpen(false)}
              >
                Pricing
              </Link>
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
      />

      <aside
        id="mobile-drawer"
        className={`mobileDrawer ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <div ref={drawerRef} className="mobileDrawerInner">
          <div className="mobileDrawerTop">
            <button
              className="mobileCloseButton"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              ✕
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
                <Link
                  href="/services/custom-video-platform"
                  className={pathname === "/services/custom-video-platform" ? "active" : ""}
                  onClick={closeMenu}
                >
                  Custom Video Platform
                </Link>

                <Link
                  href="/services/web-design-and-development"
                  className={pathname === "/services/web-design-and-development" ? "active" : ""}
                  onClick={closeMenu}
                >
                  Web Design & Development
                </Link>

                <Link
                  href="/services/business-automation"
                  className={pathname === "/services/business-automation" ? "active" : ""}
                  onClick={closeMenu}
                >
                  Business Automation
                </Link>

                <Link
                  href="/pricing"
                  className={pathname === "/pricing" ? "active" : ""}
                  onClick={closeMenu}
                >
                  Pricing
                </Link>
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
      </aside>
    </>
  );
}