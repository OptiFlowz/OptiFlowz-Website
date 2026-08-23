import Link from "next/link";
import Image from "next/image";
import FooterReveal from "./footerReveal";
import FooterWordmark from "./footerWordmark";

const socialLinks = [
  { href: "https://www.instagram.com/optiflowz/", icon: "/social/instagramSVG.svg", label: "Instagram" },
  { href: "https://www.tiktok.com/@optiflowz", icon: "/social/tikTokSVG.svg", label: "TikTok" },
  { href: "https://www.linkedin.com/company/optiflowz/", icon: "/social/linkedInSVG.svg", label: "LinkedIn" },
  { href: "https://x.com/OptiFlowz", icon: "/social/XSVG.svg", label: "X" },
  { href: "https://www.youtube.com/@OptiFlowz", icon: "/social/YouTubeSVG.svg", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <FooterReveal>
        <div className="footer-shell">
          <div className="footer-main">
            <div className="footer-intro">
              <Link className="footer-brand" href="/" aria-label="OptiFlowz home">
                <Image
                  className="footer-brand-logo"
                  src="/logo.webp"
                  alt=""
                  width={36}
                  height={36}
                  sizes="36px"
                />
                <span>OptiFlowz</span>
              </Link>
              <p>
                We build high-performing video platforms, modern websites, and
                automation systems that help ambitious businesses move faster.
              </p>
              <div className="footer-socials" aria-label="OptiFlowz social profiles">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                  >
                    <Image src={social.icon} alt="" width={22} height={22} sizes="22px" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="footer-navigation">
              <nav aria-label="Explore">
                <h3>Explore</h3>
                <Link href="/">Home</Link>
                <Link href="/about-us">About us</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/pricing">Pricing</Link>
              </nav>

              <nav aria-label="Services">
                <h3>Services</h3>
                <Link href="/services/custom-video-platform">Video platforms</Link>
                <Link href="/services/web-design-and-development">Web design</Link>
                <Link href="/services/business-automation">Automation</Link>
              </nav>

              <div className="footer-contact">
                <h3>Start a conversation</h3>
                <Link className="footer-email" href="mailto:office@optiflowz.com">
                  office@optiflowz.com
                </Link>
                <p>Mon–Fri, 09:00–17:00</p>
                <p>OptiFlowz LLC – 30 N Gould St Ste R, Sheridan, WY 82801, USA</p>
              </div>
            </div>
          </div>

          <FooterWordmark />

          <div className="footer-meta">
            <p>© 2026 OptiFlowz LLC. All rights reserved.</p>
            <div>
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/attribution">Attribution</Link>
            </div>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}
