import Link from "next/link";
import Image from "next/image";

export default function Footer(){
    return(
        <footer>
            <Image 
                className="footerBg"
                src="/footerBg.webp"
                alt="Logo"
                width={1300}
                height={650}
                priority
            />
            <div className="footerWrap">
                <div>
                    <section className="quickAbout">
                        <Link className="logo" href="/">
                            <Image 
                                src="/logo.webp"
                                alt="Logo"
                                width={120}
                                height={120}
                                style={{width: "50px", height: "50px"}}
                                priority
                            />
                            <h2>OptiFlowz</h2>
                        </Link>
                        <p>OptiFlowz is a business automation agency helping service-based companies streamline their operations, improve efficiency, and grow with smart, AI-powered systems. We deliver scalable solutions tailored to your unique workflows.</p>
                        <div className="socials">
                            <Link href="https://www.instagram.com/optiflowz/" target="_blank">
                                <Image 
                                    src="/social/instagramSVG.svg"
                                    alt="Instagram Logo"
                                    width={50}
                                    height={50}
                                    style={{width: "30px", height: "30px"}}
                                    priority
                                />
                            </Link>
                            <Link href="/" target="_blank">
                                <Image 
                                    src="/social/facebookSVG.svg"
                                    alt="Facebook Logo"
                                    width={50}
                                    height={50}
                                    style={{width: "30px", height: "30px"}}
                                    priority
                                />
                            </Link>
                            <Link href="https://www.linkedin.com/company/optiflowz/" target="_blank">
                                <Image 
                                    src="/social/linkedInSVG.svg"
                                    alt="LinkedIn Logo"
                                    width={50}
                                    height={50}
                                    style={{width: "30px", height: "30px"}}
                                    priority
                                />
                            </Link>
                            <Link href="/" target="_blank">
                                <Image 
                                    src="/social/XSVG.svg"
                                    alt="X Logo"
                                    width={50}
                                    height={50}
                                    style={{width: "30px", height: "30px"}}
                                    priority
                                />
                            </Link>
                            <Link href="https://www.youtube.com/@OptiFlowz" target="_blank">
                                <Image 
                                    src="/social/YouTubeSVG.svg"
                                    alt="YouTube Logo"
                                    width={50}
                                    height={50}
                                    style={{width: "30px", height: "30px"}}
                                    priority
                                />
                            </Link>
                        </div>
                    </section>
                    <section className="links">
                        <nav>
                            <h3>Quick Links</h3>
                            <Link href="/">Home</Link>
                            <Link href="/services">Services</Link>
                            <Link href="/about-us">About Us</Link>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                            <Link href="/attribution">Attribution</Link>
                        </nav>
                        <nav>
                            <h3>Contact</h3>
                            <p>OptiFlowz LLC – 30 N Gould St Ste R, Sheridan, WY 82801, USA</p>
                            <p>Monday–Friday 09:00–17:00</p>
                            <Link href="mailto:office@optiflowz.com">office@optiflowz.com</Link>
                        </nav>
                    </section>
                </div>
                <p className="copyright"><span className="accentText">OptiFlowz</span> – Copyright © 2026 – All rights reserved</p>
            </div>
        </footer>
    )

}