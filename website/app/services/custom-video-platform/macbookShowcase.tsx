"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import type { MacbookSceneControls } from "./macbookScene";
import styles from "./macbookShowcase.module.css";

type Props = {
  heroRef: RefObject<HTMLElement | null>;
  revealAllowed: boolean;
};
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

export default function MacbookShowcase({ heroRef, revealAllowed }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const poweredByRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<MacbookSceneControls | null>(null);
  const progressRef = useRef(0);
  const exitProgressRef = useRef(0);
  const userPaused = useRef(false);
  const userPlayed = useRef(false);
  const revealAllowedRef = useRef(revealAllowed);
  const syncPlaybackRef = useRef<(() => void) | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    revealAllowedRef.current = revealAllowed;
    syncPlaybackRef.current?.();
  }, [revealAllowed]);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const sticky = stage?.closest<HTMLElement>(".video-platform-sticky");
    const copy = hero?.querySelector<HTMLElement>(".video-platform-hero-copy");
    if (!hero || !stage || !sticky || !copy) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 560px)");
    let frame = 0;
    let lastTime = 0;
    let target = 0;
    let exitTarget = 0;
    let stickyTop = 96;
    let stickyMargin = 0;
    let entryRange = 1;
    let holdRange = 0;
    let closeRange = 1;
    const readProgress = () => motion.matches ? 0
      : clamp(-hero.getBoundingClientRect().top / entryRange);
    // The turn finishes as the frame pins. Hold the open view briefly before
    // closing, with the wordmark behind the original open display position.
    const readExitProgress = () => motion.matches || hasFailed ? 0 : clamp(
      (stickyTop - copy.getBoundingClientRect().bottom - stickyMargin - holdRange)
      / closeRange,
    );
    function paint() {
      const reveal = motion.matches ? 1 : ease(progressRef.current);
      const closing = motion.matches || hasFailed ? 0 : exitProgressRef.current;
      sceneRef.current?.setScrollProgress(reveal, motion.matches ? 0 : ease(exitProgressRef.current));
      const brand = poweredByRef.current;
      if (brand) {
        // Its position stays anchored behind the open display inside the frame.
        // Only the lid moves away to uncover it; the mark never slides below it.
        brand.style.opacity = String(ease((closing - 0.15) / 0.65));
      }
    }
    function animate(time: number) {
      frame = 0;
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      progressRef.current += (target - progressRef.current) * (1 - Math.exp(-12 * dt));
      exitProgressRef.current += (exitTarget - exitProgressRef.current) * (1 - Math.exp(-12 * dt));
      if (Math.abs(target - progressRef.current) < 0.0001) progressRef.current = target;
      if (Math.abs(exitTarget - exitProgressRef.current) < 0.0001) exitProgressRef.current = exitTarget;
      paint();
      if (progressRef.current !== target || exitProgressRef.current !== exitTarget) frame = requestAnimationFrame(animate);
      else lastTime = 0;
    }
    function syncScroll() {
      target = readProgress();
      exitTarget = readExitProgress();
      if (!frame) frame = requestAnimationFrame(animate);
    }
    function resetProgress() {
      stickyTop = Number.parseFloat(getComputedStyle(sticky!).top) || 0;
      stickyMargin = Number.parseFloat(getComputedStyle(sticky!).marginTop) || 0;
      const frameStart = copy!.getBoundingClientRect().bottom - hero!.getBoundingClientRect().top + stickyMargin;
      entryRange = Math.max(1, frameStart - stickyTop);
      holdRange = Math.min(140, window.innerHeight * 0.16, stage!.clientHeight * 0.3);
      closeRange = Math.max(1, Math.min(window.innerHeight * 0.5, stage!.clientHeight * 0.72));
      const sceneHeight = `${frameStart + sticky!.clientHeight + (motion.matches || hasFailed ? 0 : holdRange + closeRange)}px`;
      if (hero!.style.getPropertyValue("--macbook-scene-height") !== sceneHeight) {
        hero!.style.setProperty("--macbook-scene-height", sceneHeight);
      }
      target = readProgress();
      exitTarget = readExitProgress();
      progressRef.current = target;
      exitProgressRef.current = exitTarget;
      paint();
    }
    const resize = new ResizeObserver(resetProgress);
    resize.observe(hero);
    resize.observe(sticky);
    resize.observe(copy);
    window.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("resize", resetProgress);
    motion.addEventListener("change", resetProgress);
    resetProgress();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("resize", resetProgress);
      motion.removeEventListener("change", resetProgress);
      hero.style.removeProperty("--macbook-scene-height");
    };
  }, [heroRef, hasFailed]);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return;
    let disposed = false;
    let inView = false;
    let canPresent = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    video.muted = true;
    const syncPlayback = () => {
      if (canPresent && revealAllowedRef.current && inView && !document.hidden && !userPaused.current && (!reducedMotion.matches || userPlayed.current)) {
        void video.play().catch(() => { /* The play button remains available if autoplay is blocked. */ });
      } else video.pause();
    };
    syncPlaybackRef.current = syncPlayback;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);
    const playbackObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.05 });
    playbackObserver.observe(stage);
    import("./macbookScene")
      .then(({ mountMacbookScene }) => {
        if (disposed) return;
        sceneRef.current = mountMacbookScene(stage, video, (ready) => {
          if (!disposed) {
            setIsReady(ready);
            setHasFailed(!ready);
            canPresent = true;
            syncPlayback();
            const staticView = window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 560px)").matches;
            sceneRef.current?.setScrollProgress(staticView ? 1 : ease(progressRef.current), staticView ? 0 : ease(exitProgressRef.current));
          }
        });
        const staticView = window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 560px)").matches;
        sceneRef.current.setScrollProgress(staticView ? 1 : ease(progressRef.current), staticView ? 0 : ease(exitProgressRef.current));
      })
      .catch(() => {
        if (!disposed) {
          setHasFailed(true);
          canPresent = true;
          syncPlayback();
        }
      });
    return () => {
      disposed = true;
      syncPlaybackRef.current = null;
      playbackObserver.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.pause();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPlayed.current = true;
      userPaused.current = false;
      void video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  return (
    <div className={`${styles.showcase} ${isReady ? styles.ready : ""} ${hasFailed ? styles.failed : ""} ${revealAllowed && (isReady || hasFailed) ? styles.revealed : ""}`}>
      <div className={styles.deviceFrame}>
        <div ref={poweredByRef} className={styles.poweredBy} aria-hidden="true">
          <Image src="/video-platform/powered-by-optiflowz.fa79794a.svg" width={1934} height={141}
            alt="Powered by the OptiFlowz Video Platform" loading="eager" />
        </div>
        <div ref={stageRef} className={styles.stage} role="img" aria-hidden={hasFailed}
          aria-label="A 14-inch Space Black MacBook Pro displaying the OptiFlowz platform. Scroll to rotate it toward you, then close the lid as it leaves the screen." />
        <video ref={videoRef} className={styles.videoSource} src="/video-platform/platform-tour.mp4"
          poster="/video-platform/platform-tour-poster.webp" muted loop playsInline preload="metadata"
          aria-hidden={!hasFailed} aria-label="OptiFlowz video platform demonstration" />
      </div>
      <div className={styles.bottomBar}>
        <button className="button white" type="button" onClick={toggleVideo} aria-label={isPlaying ? "Pause platform demo" : "Play platform demo"}>
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="4" y="3" width="2.5" height="10" rx="0.7" /><rect x="9.5" y="3" width="2.5" height="10" rx="0.7" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="m5 2.7 8 5.3-8 5.3V2.7Z" /></svg>
          )}
          {isPlaying ? "Pause demo" : "Play demo"}
        </button>
      </div>
    </div>
  );
}
