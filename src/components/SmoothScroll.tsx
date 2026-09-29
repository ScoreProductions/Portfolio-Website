"use client";

import Lenis from "lenis";
import { useEffect } from "react";

let instance: Lenis | null = null;

export function lockScroll(locked: boolean) {
  if (locked) instance?.stop();
  else instance?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -60 } });
    instance = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);
  return null;
}
