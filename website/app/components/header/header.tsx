'use client'
import { memo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowSVG } from "@/app/constants";

function Header(){
    const pathname = usePathname();

    return (
        <header>
            <Link href="/">
                <Image 
                    src="/logo.webp"
                    alt="Logo"
                    width={100}
                    height={100}
                    style={{width: "40px", height: "40px"}}
                    priority
                />
            </Link>

            <nav>
                <Link
                    href="/"
                    className={pathname === "/" ? "active" : ''}
                >Home</Link>

                <Link
                    href="/services"
                    className={pathname === "/services" ? "active" : ''}
                >Services</Link>

                <Link
                    href="/about-us"
                    className={pathname === "/about-us" ? "active" : ''}
                >About Us</Link>
            </nav>

            <Link href="/contact" className="button">Get In Contact{ArrowSVG}</Link>
        </header>
    );   
}

export default memo(Header);