'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowSVG } from "@/app/constants";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = () => setMenuOpen(false);
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
      if (e.key === "Escape") closeMenu();
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

          <Link href="/services" className={pathname === "/services" ? "active" : ""}>
            Services
          </Link>

          <Link href="/pricing" className={pathname === "/pricing" ? "active" : ""}>
            Pricing
          </Link>

          <Link href="/about-us" className={pathname === "/about-us" ? "active" : ""}>
            About Us
          </Link>
        </nav>

        <Link
          href="/#contactForm"
          className="button desktopContactButton"
          onClick={scrollToContact}
        >
          Get In Contact{ArrowSVG}
        </Link>

        <button
          className={`mobileMenuButton ${menuOpen ? "open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-drawer"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
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

            <Link
              href="/services"
              className={pathname === "/services" ? "active" : ""}
              onClick={closeMenu}
            >
              Services
            </Link>

            <Link
              href="/pricing"
              className={pathname === "/pricing" ? "active" : ""}
              onClick={closeMenu}
            >
              Pricing
            </Link>

            <Link
              href="/about-us"
              className={pathname === "/about-us" ? "active" : ""}
              onClick={closeMenu}
            >
              About Us
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