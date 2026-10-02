"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping background video that also autoplays in Safari/iOS:
 * React doesn't write the `muted` attribute to the DOM, so we set it on the element and call play() ourselves.
 * The poster stays visible if a browser still refuses (e.g. iOS Low Power Mode).
 */
export default function BackgroundVideo({ src, poster, className = "" }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const webm = src.replace(/\.mp4$/i, ".webm");

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    const play = () => v.play().catch(() => {});
    play();
    // Retry once the user interacts or the tab becomes visible (some browsers block autoplay until then).
    const retry = () => v.paused && play();
    document.addEventListener("visibilitychange", retry);
    window.addEventListener("touchstart", retry, { once: true, passive: true });
    window.addEventListener("click", retry, { once: true });
    return () => {
      document.removeEventListener("visibilitychange", retry);
      window.removeEventListener("touchstart", retry);
      window.removeEventListener("click", retry);
    };
  }, [src]);

  return (
    <video ref={ref} poster={poster} autoPlay muted loop playsInline preload="auto" disablePictureInPicture className={className}>
      <source src={src} type="video/mp4" />
      {webm !== src && <source src={webm} type="video/webm" />}
    </video>
  );
}
