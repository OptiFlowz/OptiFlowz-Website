import type { MacbookSceneControls } from "./macbookScene";

/** Same poses as the desktop scene, baked at 30 fps with every frame seekable. */
export function mountMacbookVideo(
  host: HTMLElement,
  onReady: (ready: boolean) => void,
): MacbookSceneControls {
  const video = document.createElement("video");
  const size = window.matchMedia("(width < 500px)").matches ? "small" : "medium";
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.disablePictureInPicture = true;
  video.setAttribute("aria-hidden", "true");
  video.poster = `/video-platform/macbook-scroll-${size}.webp`;
  video.src = `/video-platform/macbook-scroll-${size}.mp4`;
  host.appendChild(video);
  let targetTime = 0;
  let disposed = false;
  let frame = 0;
  let displayedFrame = 0;
  let pendingFrame: number | null = null;
  let hasPresented = false;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 560px)");
  const fps = 30;

  function present() {
    if (!hasPresented) {
      hasPresented = true;
      onReady(true);
    }
  }

  function seek() {
    frame = 0;
    if (disposed || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.seeking) return;
    const lastFrame = Math.min(180, Math.round(video.duration * fps) - 1);
    const targetFrame = Math.min(lastFrame, Math.max(0, Math.round(targetTime * fps)));
    // Advance from the last decoded pose, not the last requested currentTime.
    // Bound catch-up after a fast swipe or slow decode to two adjacent frames.
    // The first pose is sought while hidden, so page restoration never flashes
    // the initial laptop angle before jumping to the restored scroll position.
    const nextFrame = !hasPresented || motion.matches ? targetFrame
      : displayedFrame + Math.max(-2, Math.min(2, targetFrame - displayedFrame));
    if (nextFrame === displayedFrame) {
      present();
      return;
    }
    pendingFrame = nextFrame;
    // Seek inside a frame rather than onto a timestamp boundary that decoders
    // can round to the previous frame, especially when reversing direction.
    video.currentTime = (nextFrame + 0.1) / fps;
  }
  function schedule() {
    if (!disposed && !frame) frame = requestAnimationFrame(seek);
  }
  function decoded() {
    if (pendingFrame !== null) displayedFrame = pendingFrame;
    pendingFrame = null;
    present();
    schedule();
  }
  function failed() { onReady(false); }
  video.addEventListener("loadeddata", schedule);
  video.addEventListener("canplay", schedule);
  video.addEventListener("seeked", decoded);
  video.addEventListener("error", failed);
  video.load();

  return {
    setScrollProgress(progress, exitProgress) {
      // Frames 0–90 turn toward the viewer; 90–180 close the lid.
      targetTime = (Math.min(1, progress) + Math.max(0, exitProgress)) * 3;
      schedule();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      video.removeEventListener("loadeddata", schedule);
      video.removeEventListener("canplay", schedule);
      video.removeEventListener("seeked", decoded);
      video.removeEventListener("error", failed);
      video.removeAttribute("src");
      video.load();
      video.remove();
    },
  };
}
