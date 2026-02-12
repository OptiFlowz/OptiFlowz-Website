import Image from "next/image";
import Header from "./components/header/header";
import type { Metadata } from 'next'
import { DisplaySVG, RocketSVG, VideocamSVG } from "./constants";

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to the homepage of Optiflowz'
}

export default function Home() {
  return (
    <main className="mainPage">
      <Header />

      <div className="first">
        <div className="hero">
          <h2>Build Smarter.<br/>Automate Faster.<br/>Slace with <p className="optiflowz">OptiFlowz</p></h2>

          <div className="background">
            <span className="topShadow"></span>
            <video src="/homeBg.mp4" muted autoPlay loop />
            <span className="bottomShadow"></span>
          </div>

          <Image 
              src="/heroImage.webp"
              alt="Logo"
              width={500}
              height={500}
              style={{width: "400px", height: "400px"}}
              priority
          />
        </div>

        <div className="areas">
          <span>
            {VideocamSVG}
            <h3>Custom Video Platforms</h3>
            <p>Enterprise-grade streaming solutions tailored to your brand. From corporate training to global distribution, we build high-performance platforms that scale.</p>            
          </span>

          <span>
            {DisplaySVG}
            <h3>Web Design & Development</h3>
            <p>Modern, responsive websites built with cutting-edge technology. From landing pages to complex web applications, we bring your vision to life.</p>            
          </span>

          <span>
            {RocketSVG}
            <h3>Business Automation</h3>
            <p>Streamline your workflows and eliminate repetitive tasks. We create custom automation solutions that save time and reduce costs.</p>            
          </span>
        </div>
      </div>
    </main>
  );
}
