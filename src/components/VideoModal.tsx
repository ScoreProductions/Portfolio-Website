"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { embedUrl } from "@/lib/site";
import { lockScroll } from "./SmoothScroll";

export type ModalContent = {
  title: string;
  video: string;
  meta?: ReactNode;
  vertical?: boolean;
  /** Present when the project has several videos to step through. */
  nav?: { index: number; count: number; go: (d: number) => void };
};

export default function VideoModal({ content, onClose }: { content: ModalContent | null; onClose: () => void }) {
  const isOpen = !!content;
  const nav = content?.nav;
  const navRef = useRef(nav);
  const swipeStart = useRef<number | null>(null);

  useEffect(() => {
    navRef.current = nav;
  });

  useEffect(() => {
    if (!isOpen) return;
    lockScroll(true);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navRef.current?.go(-1);
      if (e.key === "ArrowRight") navRef.current?.go(1);
    };
    window.addEventListener("keydown", key);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", key);
    };
  }, [isOpen, onClose]);

  const embed = content?.video ? embedUrl(content.video) : null;

  return (
    <AnimatePresence>
      {content && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-center justify-center bg-fg/80 p-3 backdrop-blur-md md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={content.title}
          data-lenis-prevent
        >
          <motion.div
            className={`relative grid max-h-full w-full gap-0 overflow-y-auto rounded-3xl bg-white ${content.vertical ? "max-w-5xl md:grid-cols-[auto_1fr]" : "max-w-6xl md:grid-cols-[1.6fr_1fr]"}`}
            initial={{ y: 60, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => (swipeStart.current = e.clientX)}
            onPointerUp={(e) => {
              if (swipeStart.current === null || !nav) return;
              const dx = e.clientX - swipeStart.current;
              swipeStart.current = null;
              if (Math.abs(dx) > 50) nav.go(dx < 0 ? 1 : -1);
            }}
          >
            <div className={`relative bg-fg ${content.vertical ? "mx-auto aspect-[9/16] h-[70vh] md:h-[85vh] md:max-h-[860px]" : "aspect-video md:aspect-auto md:min-h-[420px]"}`}>
              {embed ? (
                <iframe key={embed} src={embed} title={content.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
              ) : content.video ? (
                <video key={content.video} src={content.video} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-contain" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-accent text-white">
                  <span className="text-sm font-medium uppercase tracking-[0.25em]">Video volgt</span>
                </div>
              )}
            </div>
            <div className="flex flex-col p-6 md:p-10">
              {nav && (
                <div className="mb-6 flex items-center gap-3 pr-12">
                  {[-1, 1].map((d) => (
                    <button
                      key={d}
                      onClick={() => nav.go(d)}
                      aria-label={d < 0 ? "Vorige video" : "Volgende video"}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d={d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                  <span className="text-sm font-medium text-muted">
                    Video {nav.index + 1} van {nav.count}
                  </span>
                </div>
              )}
              <h3 className="text-3xl font-semibold tracking-tight md:text-5xl">{content.title}</h3>
              <div className="mt-6 flex-1">{content.meta}</div>
            </div>
            <button
              onClick={onClose}
              aria-label="Sluiten"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-fg shadow-lg transition-transform duration-300 hover:rotate-90"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
