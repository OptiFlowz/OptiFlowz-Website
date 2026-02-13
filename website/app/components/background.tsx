"use client"
import { memo, useEffect, useRef } from "react";

function Background() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.playsInline = true;

    // iOS Safari legacy atribut
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    const play = () => v.play().catch(() => {});
    play();

    window.addEventListener("touchstart", play, { once: true, passive: true });
    return () => window.removeEventListener("touchstart", play);
  }, []);

  return (
    <div className="background">
      <span className="topShadow" />
      <video
        ref={videoRef}
        src="/homeBg.mp4"
        muted
        autoPlay
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* <Image
            src="/homeBg.gif"
            alt="Logo"
            width={500}
            height={500}
            priority
        /> */}
      <span className="bottomShadow" />
    </div>
  );
}

export default memo(Background);