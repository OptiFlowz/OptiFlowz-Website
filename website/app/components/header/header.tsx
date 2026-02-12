'use client'
import { memo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Header(){
    const pathname = usePathname();

    return (
        <header>
            <div>
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
                        href="/aboutUs"
                        className={pathname === "/aboutUs" ? "active" : ''}
                    >About Us</Link>
                </nav>

                <Link href="/getInContact" className="getInContact">Get In Contact</Link>
            </div>
        </header>
    );   
}

export default memo(Header);